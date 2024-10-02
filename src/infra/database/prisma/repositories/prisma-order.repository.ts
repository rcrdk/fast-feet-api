import { Injectable } from '@nestjs/common'

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
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { PrismaOrderMapper } from '../mappers/prisma-order.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
	constructor(private prisma: PrismaService) {}

	async findById(id: string) {
		const order = await this.prisma.order.findUnique({
			where: {
				id,
			},
		})

		if (!order) {
			return null
		}

		return PrismaOrderMapper.toDomain(order)
	}

	async findManyByAvailability({
		city,
		state,
		page,
		perPage,
	}: FindManyByAvailabilityParams) {
		const orders = await this.prisma.order.findMany({
			where: {
				currentLocation: {
					city: {
						contains: city,
						mode: 'insensitive',
					},
					state: {
						contains: state,
						mode: 'insensitive',
					},
				},
				currentStatusCode: {
					in: ['POSTED', 'AWAITING_PICK_UP'],
				},
				deliveryPersonId: {
					not: null,
				},
			},
			orderBy: {
				updatedAt: 'desc',
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		const countOrders = await this.prisma.order.count({
			where: {
				currentLocation: {
					city: {
						contains: city,
						mode: 'insensitive',
					},
					state: {
						contains: state,
						mode: 'insensitive',
					},
				},
				currentStatusCode: {
					in: ['POSTED', 'AWAITING_PICK_UP'],
				},
				deliveryPersonId: {
					not: null,
				},
			},
		})

		return {
			data: orders.map((item) => {
				return PrismaOrderMapper.toDomain(item)
			}),
			perPage,
			totalPages: Math.ceil(countOrders / perPage),
			totalItems: countOrders,
		}
	}

	async findManyByDeliveryPerson({
		deliveryPersonId,
		page,
		perPage,
	}: FindManyByDeliveryPersonParams) {
		const orders = await this.prisma.order.findMany({
			where: {
				deliveryPersonId,
			},
			orderBy: {
				updatedAt: 'desc',
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		const countOrders = await this.prisma.order.count({
			where: {
				deliveryPersonId,
			},
		})

		return {
			data: orders.map((item) => {
				return PrismaOrderMapper.toDomain(item)
			}),
			perPage,
			totalPages: Math.ceil(countOrders / perPage),
			totalItems: countOrders,
		}
	}

	async findManyByReceiver({
		receiverId,
		page,
		perPage,
	}: FindManyByReceiverParams) {
		const orders = await this.prisma.order.findMany({
			where: {
				receiverId,
			},
			orderBy: {
				updatedAt: 'desc',
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		const countOrders = await this.prisma.order.count({
			where: {
				receiverId,
			},
		})

		return {
			data: orders.map((item) => {
				return PrismaOrderMapper.toDomain(item)
			}),
			perPage,
			totalPages: Math.ceil(countOrders / perPage),
			totalItems: countOrders,
		}
	}

	async findManyByFilters({
		currentDeliveryPersonId,
		currentLocationId,
		currentStatus,
		receiverId,
		updatedFrom,
		updatedUntil,
		page,
		perPage,
	}: FindManyByFiltersParams) {
		const orders = await this.prisma.order.findMany({
			where: {
				OR: [
					{
						deliveryPersonId: currentDeliveryPersonId ?? undefined,
					},
					{
						receiverId: receiverId ?? undefined,
					},
					{
						currentLocationId: currentLocationId ?? undefined,
					},
					{
						currentStatusCode: currentStatus ?? undefined,
					},
				],
				AND: {
					updatedAt: {
						lte: updatedFrom ?? undefined,
						gte: updatedUntil ?? undefined,
					},
				},
			},
			orderBy: {
				updatedAt: 'desc',
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		const countOrders = await this.prisma.order.count({
			where: {
				OR: [
					{
						deliveryPersonId: currentDeliveryPersonId ?? undefined,
					},
					{
						receiverId: receiverId ?? undefined,
					},
					{
						currentLocationId: currentLocationId ?? undefined,
					},
					{
						currentStatusCode: currentStatus ?? undefined,
					},
				],
				AND: {
					updatedAt: {
						lte: updatedFrom ?? undefined,
						gte: updatedUntil ?? undefined,
					},
				},
			},
		})

		return {
			data: orders.map((item) => {
				return PrismaOrderMapper.toDomain(item)
			}),
			perPage,
			totalPages: Math.ceil(countOrders / perPage),
			totalItems: countOrders,
		}
	}

	async findByReceiver({ orderId, receiverId }: FindByReceiverParams) {
		const order = await this.prisma.order.findUnique({
			where: {
				id: orderId,
				receiverId,
			},
		})

		if (!order) {
			return null
		}

		return PrismaOrderMapper.toDomain(order)
	}

	async create(order: Order) {
		const data = PrismaOrderMapper.toPrisma(order)

		const newOrder = await this.prisma.order.create({
			data,
		})

		await this.prisma.status.create({
			data: {
				orderId: newOrder.id,
				creatorId: newOrder.creatorId,
				currentLocationId: newOrder.originLocationId,
				statusCode: 'POSTED',
			},
		})
	}

	async updateDeliveryPerson({
		authPersonId,
		data: order,
	}: UpdateDeliveryPersonParams) {
		const data = PrismaOrderMapper.toPrisma(order)

		const orderSelected = await this.prisma.order.update({
			where: {
				id: data.id,
			},
			data,
		})

		await this.prisma.status.create({
			data: {
				orderId: orderSelected.id,
				creatorId: authPersonId,
				currentLocationId: orderSelected.originLocationId,
				statusCode: orderSelected.deliveryPersonId
					? 'PICKED'
					: 'AWAITING_PICK_UP',
			},
		})
	}

	async delete(order: Order) {
		const data = PrismaOrderMapper.toPrisma(order)

		await this.prisma.order.delete({
			where: {
				id: data.id,
			},
		})
	}

	async setStatusPicked(order: Order) {
		const data = PrismaOrderMapper.toPrisma(order)

		const updatedOrder = await this.prisma.order.update({
			where: {
				id: data.id,
			},
			data,
		})

		await this.prisma.status.create({
			data: {
				orderId: updatedOrder.id,
				creatorId: updatedOrder.deliveryPersonId ?? updatedOrder.creatorId,
				currentLocationId: updatedOrder.currentLocationId,
				statusCode: 'PICKED',
			},
		})
	}

	async setStatusTransferProgress(order: Order) {
		const data = PrismaOrderMapper.toPrisma(order)

		const updatedOrder = await this.prisma.order.update({
			where: {
				id: data.id,
			},
			data,
		})

		await this.prisma.status.create({
			data: {
				orderId: updatedOrder.id,
				creatorId: updatedOrder.deliveryPersonId ?? updatedOrder.creatorId,
				currentLocationId: updatedOrder.currentLocationId,
				statusCode: 'TRANSFER_PROCESS',
			},
		})
	}

	async setStatusTransferFinished(order: Order) {
		const data = PrismaOrderMapper.toPrisma(order)

		const updatedOrder = await this.prisma.order.update({
			where: {
				id: data.id,
			},
			data,
		})

		await this.prisma.status.create({
			data: {
				orderId: updatedOrder.id,
				creatorId: updatedOrder.deliveryPersonId ?? updatedOrder.creatorId,
				currentLocationId: updatedOrder.currentLocationId,
				statusCode: 'TRANSFER_FINISHED',
			},
		})
	}

	async setStatusOnRoute({ order, details }: OrderStatusWithDetails) {
		const data = PrismaOrderMapper.toPrisma(order)

		const updatedOrder = await this.prisma.order.update({
			where: {
				id: data.id,
			},
			data,
		})

		await this.prisma.status.create({
			data: {
				orderId: updatedOrder.id,
				creatorId: updatedOrder.deliveryPersonId ?? updatedOrder.creatorId,
				currentLocationId: updatedOrder.currentLocationId,
				statusCode: 'ON_ROUTE',
				details,
			},
		})
	}

	async setStatusCanceled({ order, details }: OrderStatusWithDetails) {
		const data = PrismaOrderMapper.toPrisma(order)

		const updatedOrder = await this.prisma.order.update({
			where: {
				id: data.id,
			},
			data,
		})

		await this.prisma.status.create({
			data: {
				orderId: updatedOrder.id,
				creatorId: updatedOrder.deliveryPersonId ?? updatedOrder.creatorId,
				currentLocationId: updatedOrder.currentLocationId,
				statusCode: 'CANCELED',
				details,
			},
		})
	}

	async setStatusReturned({ order, details }: OrderStatusWithDetails) {
		const data = PrismaOrderMapper.toPrisma(order)

		const updatedOrder = await this.prisma.order.update({
			where: {
				id: data.id,
			},
			data,
		})

		await this.prisma.status.create({
			data: {
				orderId: updatedOrder.id,
				creatorId: updatedOrder.deliveryPersonId ?? updatedOrder.creatorId,
				currentLocationId: updatedOrder.currentLocationId,
				statusCode: 'RETURNED',
				details,
			},
		})
	}

	async setStatusDelivered({
		order,
		details,
		attachmentId,
	}: OrderStatusWithDetailsAndAttachment) {
		const data = PrismaOrderMapper.toPrisma(order)

		const updatedOrder = await this.prisma.order.update({
			where: {
				id: data.id,
			},
			data,
		})

		const newStatusSetted = await this.prisma.status.create({
			data: {
				orderId: updatedOrder.id,
				creatorId: updatedOrder.deliveryPersonId ?? updatedOrder.creatorId,
				currentLocationId: updatedOrder.currentLocationId,
				statusCode: 'RETURNED',
				attachmentId,
				details,
			},
		})

		if (attachmentId) {
			const attachment = await this.prisma.attachment.findUnique({
				where: {
					id: attachmentId,
				},
			})

			await this.prisma.attachment.update({
				where: {
					id: attachmentId,
				},
				data: {
					...attachment,
					orderStatusId: newStatusSetted.id,
				},
			})
		}
	}
}
