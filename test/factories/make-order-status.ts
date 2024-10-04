import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	OrderStatus,
	OrderStatusProps,
} from '@/domain/logistic/enterprise/entities/order-status'
import { PrismaOrderStatusMapper } from '@/infra/database/prisma/mappers/prisma-order-status.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeOrderStatus(
	override: Partial<OrderStatusProps> = {},
	id?: UniqueEntityId,
) {
	const status = OrderStatus.create(
		{
			orderId: new UniqueEntityId('order-01'),
			creatorId: new UniqueEntityId('creator-01'),
			statusCode: 'POSTED',
			...override,
		},
		id,
	)

	return status
}

@Injectable()
export class OrderStatusFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaOrderStatus(
		data: Partial<OrderStatusProps> = {},
	): Promise<OrderStatus> {
		const status = makeOrderStatus(data)

		await this.prisma.status.create({
			data: PrismaOrderStatusMapper.toPrisma(status),
		})

		return status
	}
}
