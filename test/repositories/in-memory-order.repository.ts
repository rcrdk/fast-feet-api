/* eslint-disable prettier/prettier */
import {
	FindByReceiverParams,
	FindManyByAvailabilityParams,
	FindManyByDeliveryPersonParams,
	FindManyByReceiverParams,
	OrderRepository,
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
					`Author with id "${order.currentLocationId.toString()}" does not exists.`,
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

	async delete(data: Order) {
		const findIndex = this.items.findIndex((item) => item.id.equals(data.id))
		this.items.splice(findIndex, 1)

		const orderId = data.id.toString()
		this.orderStatusRepository.deleteMany(orderId)
	}
}
