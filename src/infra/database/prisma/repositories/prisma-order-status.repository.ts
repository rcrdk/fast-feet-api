import { Injectable } from '@nestjs/common'

import { OrderStatusRepository } from '@/domain/logistic/application/repositories/order-status.repository'
import { OrderStatus } from '@/domain/logistic/enterprise/entities/order-status'

import { PrismaOrderStatusMapper } from '../mappers/prisma-order-status.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrderStatusRepository implements OrderStatusRepository {
	constructor(private prisma: PrismaService) {}

	async findById(id: string): Promise<OrderStatus | null> {
		const status = await this.prisma.status.findUnique({
			where: {
				id,
			},
		})

		if (!status) {
			return null
		}

		return PrismaOrderStatusMapper.toDomain(status)
	}

	async create(order: OrderStatus): Promise<void> {
		const data = PrismaOrderStatusMapper.toPrisma(order)

		await this.prisma.status.create({
			data,
		})
	}

	async deleteMany(orderId: string): Promise<void> {
		await this.prisma.status.deleteMany({
			where: {
				orderId,
			},
		})
	}
}
