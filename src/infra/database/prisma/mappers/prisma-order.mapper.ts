import { Order as PrismaOrder, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/logistic/enterprise/entities/order'

export class PrismaOrderMapper {
	static toDomain(raw: PrismaOrder): Order {
		return Order.create(
			{
				currentStatusCode: raw.currentStatusCode,
				creatorId: new UniqueEntityId(raw.creatorId),
				receiverId: new UniqueEntityId(raw.receiverId),
				originLocationId: new UniqueEntityId(raw.originLocationId),
				currentLocationId: new UniqueEntityId(raw.currentLocationId),
				deliveryPersonId: raw.deliveryPersonId
					? new UniqueEntityId(raw.deliveryPersonId)
					: null,
				postedAt: raw.postedAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
		return {
			id: order.id.toString(),
			currentStatusCode: order.currentStatusCode,
			creatorId: order.creatorId.toString(),
			receiverId: order.receiverId.toString(),
			originLocationId: order.originLocationId.toString(),
			currentLocationId: order.currentLocationId.toString(),
			deliveryPersonId: order.deliveryPersonId?.toString(),
			postedAt: order.postedAt,
			updatedAt: order.updatedAt,
		}
	}
}
