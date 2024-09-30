/* eslint-disable prettier/prettier */
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	FindByReceiverParams,
	FindManyByAvailabilityParams,
	FindManyByDeliveryPersonParams,
	FindManyByFiltersParams,
	FindManyByReceiverParams,
	OrderRepository,
	OrderStatusWithDetails,
	OrderStatusWithDetailsAndAttachment,
	UpdateDeliveryPersonParams,
} from '@/domain/logistic/application/repositories/order.repository'
import { DistributionCenter } from '@/domain/logistic/enterprise/entities/distribution-center'
import { Order } from '@/domain/logistic/enterprise/entities/order'
import { OrderStatus } from '@/domain/logistic/enterprise/entities/order-status'
import { normalizeSearch } from '@/infra/utils/normalize'

import { InMemoryDistributionCenterRepository } from './in-memory-distribution-center.repository'
import { InMemoryOrderStatusRepository } from './in-memory-order-status.repository'

interface OrderWithLocation {
	order: Order,
	distributionCenter: DistributionCenter
}

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export class InMemoryOrderRepository implements OrderRepository {
	public items: Order[] = []

	constructor(
		private orderStatusRepository: InMemoryOrderStatusRepository,
		private distributionCenterRepository: InMemoryDistributionCenterRepository,
	) {}

	async findById(orderId: string) {
		const order = this.items.find((item) => item.id.toString() === orderId)

		return order ?? null
	}

	async findManyByAvailability({
		city,
		state,
		page,
		perPage,
	}: FindManyByAvailabilityParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const allOrdersWithOriginLocation: OrderWithLocation[] = this.items.map((order) => {
			const distributionCenter = this.distributionCenterRepository.items.find((locale) => locale.id.equals(order.currentLocationId))

			if (!distributionCenter) {
				throw new Error(
					`Distribution center with id "${order.currentLocationId.toString()}" does not exists.`,
				)
			}

			return {
				order,
				distributionCenter,
			}
		}) 

		const ordersFilteredIds = allOrdersWithOriginLocation
			.filter((item) => {
				const location = normalizeSearch(city, item.distributionCenter.city) && normalizeSearch(state, item.distributionCenter.state)
				const status = item.order.currentStatusCode === 'POSTED' || item.order.currentStatusCode === 'AWAITING_PICK_UP'
				const withoutDeliveryPerson = !item.order.deliveryPersonId?.toString()
				return location && status && withoutDeliveryPerson
			})
			.map((item) => item.order.id)

		const filteredOrders = this.items
			.filter((order) => ordersFilteredIds.includes(order.id))
			.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())	

		return {
			data: filteredOrders.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END),
			perPage,
			totalPages: Math.ceil(filteredOrders.length / perPage),
			totalItems: filteredOrders.length,
		}
	}

	async findManyByDeliveryPerson({
		deliveryPersonId,
		page,
		perPage
	}: FindManyByDeliveryPersonParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const filteredOrders = this.items.filter((item) => {
			return item.deliveryPersonId?.toString() === deliveryPersonId
		}).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

		return {
			data: filteredOrders.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END),
			perPage,
			totalPages: Math.ceil(filteredOrders.length / perPage),
			totalItems: filteredOrders.length,
		}
	}

	async findManyByReceiver({ receiverId, page, perPage }: FindManyByReceiverParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const filteredOrders = this.items.filter((item) => {
			return item.receiverId.toString() === receiverId
		}).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

		return {
			data: filteredOrders.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END),
			perPage,
			totalPages: Math.ceil(filteredOrders.length / perPage),
			totalItems: filteredOrders.length,
		}
	}

	async findByReceiver({ orderId, receiverId }: FindByReceiverParams) {
		const order = this.items.find((item) => {
			return item.id.toString() === orderId && item.receiverId.toString() === receiverId
		})

		return order ?? null
	}

	async findManyByFilters({ currentDeliveryPersonId, currentLocationId, currentStatus, receiverId, updatedFrom, updatedUntil, page, perPage }: FindManyByFiltersParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		let items = this.items

		if (currentDeliveryPersonId) items = items.filter((order) => order.deliveryPersonId?.toString() === currentDeliveryPersonId)
		if (currentLocationId) items = items.filter((order) => order.currentLocationId?.toString() === currentLocationId)
		if (currentStatus) items = items.filter((order) => order.currentStatusCode === currentStatus)
		if (receiverId) items = items.filter((order) => order.receiverId.toString() === receiverId)

		if (updatedFrom && updatedUntil) {
			items = items.filter((order) => {
				const orderDate = dayjs(order.updatedAt).startOf('day')
				const paramStartDate = dayjs(updatedFrom).startOf('day')
				const paramEndDate = dayjs(updatedUntil).startOf('day')

				return dayjs(orderDate).isSameOrAfter(paramStartDate) && dayjs(orderDate).isSameOrBefore(paramEndDate)
			})
		}

		if (updatedFrom && !updatedUntil) {
			items = items.filter((order) => {
				const orderDate = dayjs(order.updatedAt).startOf('day')
				const paramStartDate = dayjs(updatedFrom).startOf('day')

				return dayjs(orderDate).isSameOrAfter(paramStartDate)
			})
		}

		if (updatedUntil && !updatedFrom) {
			items = items.filter((order) => {
				const orderDate = dayjs(order.updatedAt).startOf('day')
				const paramEndDate = dayjs(updatedUntil).startOf('day')

				return dayjs(orderDate).isSameOrBefore(paramEndDate)
			})
		}

		items = items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

		return {
			data: items.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END),
			perPage,
			totalPages: Math.ceil(items.length / perPage),
			totalItems: items.length,
		}
	}

	async create(data: Order) {
		this.items.push(data)

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: data.id,
				creatorId: data.creatorId,
				currentLocationId: data.originLocationId,
				statusCode: 'POSTED',
			}),
		)
	}

	async updateDeliveryPerson({ data, authPersonId }: UpdateDeliveryPersonParams) {
		const index = this.items.findIndex((item) => item.id === data.id)

		this.items[index] = data

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: data.id,
				creatorId: new UniqueEntityId(authPersonId),
				currentLocationId: data.currentLocationId,
				statusCode: data.deliveryPersonId ? 'PICKED' : 'AWAITING_PICK_UP',
			})
		)
	}

	async delete(data: Order) {
		const findIndex = this.items.findIndex((item) => item.id.equals(data.id))
		this.items.splice(findIndex, 1)

		const orderId = data.id.toString()
		this.orderStatusRepository.deleteMany(orderId)
	}

	async setStatusPicked(data: Order) {
		const index = this.items.findIndex((item) => item.id === data.id)
		this.items[index] = data

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: data.id,
				creatorId: data.deliveryPersonId ?? data.creatorId,
				currentLocationId: data.currentLocationId,
				statusCode: 'PICKED',
			})
		)
	}

	async setStatusTransferProgress(data: Order) {
		const index = this.items.findIndex((item) => item.id === data.id)
		this.items[index] = data

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: data.id,
				creatorId: data.deliveryPersonId ?? data.creatorId,
				currentLocationId: data.currentLocationId,
				statusCode: 'TRANSFER_PROCESS',
			})
		)
	}

	async setStatusTransferFinished(data: Order) {
		const index = this.items.findIndex((item) => item.id === data.id)
		this.items[index] = data

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: data.id,
				creatorId: data.deliveryPersonId ?? data.creatorId,
				currentLocationId: data.currentLocationId,
				statusCode: 'TRANSFER_FINISHED',
			})
		)
	}

	async setStatusOnRoute({ order, details }: OrderStatusWithDetails) {
		const index = this.items.findIndex((item) => item.id === order.id)
		this.items[index] = order

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: order.id,
				creatorId: order.deliveryPersonId ?? order.creatorId,
				currentLocationId: order.currentLocationId,
				statusCode: 'ON_ROUTE',
				details,
			})
		)
	}

	async setStatusCanceled({ order, details }: OrderStatusWithDetails) {
		const index = this.items.findIndex((item) => item.id === order.id)
		this.items[index] = order

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: order.id,
				creatorId: order.deliveryPersonId ?? order.creatorId,
				currentLocationId: order.currentLocationId,
				statusCode: 'CANCELED',
				details,
			})
		)
	}

	async setStatusReturned({ order, details }: OrderStatusWithDetails) {
		const index = this.items.findIndex((item) => item.id === order.id)
		this.items[index] = order

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: order.id,
				creatorId: order.deliveryPersonId ?? order.creatorId,
				currentLocationId: order.currentLocationId,
				statusCode: 'RETURNED',
				details,
			})
		)
	}

	async setStatusDelivered({ order, details, attachmentId }: OrderStatusWithDetailsAndAttachment) {
		const index = this.items.findIndex((item) => item.id === order.id)
		this.items[index] = order

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: order.id,
				creatorId: order.deliveryPersonId ?? order.creatorId,
				currentLocationId: undefined,
				statusCode: 'DELIVERED',
				attachmentId: new UniqueEntityId(attachmentId),
				details,
			})
		)
	}
}
