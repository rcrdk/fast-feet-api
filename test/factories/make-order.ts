import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/logistic/enterprise/entities/order'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeOrder(
	override: Partial<OrderProps> = {},
	id?: UniqueEntityId,
) {
	const order = Order.create(
		{
			creatorId: new UniqueEntityId('creator-01'),
			originLocationId: new UniqueEntityId('distribution-center-01'),
			currentLocationId: new UniqueEntityId('distribution-center-01'),
			receiverId: new UniqueEntityId('receiver-01'),
			currentStatusCode: 'POSTED',
			...override,
		},
		id,
	)

	return order
}

@Injectable()
export class OrderFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
		const order = makeOrder(data)

		await this.prisma.order.create({
			data: PrismaOrderMapper.toPrisma(order),
		})

		return order
	}
}
