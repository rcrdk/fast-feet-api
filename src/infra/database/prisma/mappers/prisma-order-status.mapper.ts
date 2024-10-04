import { Prisma, Status as PrismaOrderStatus } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderStatus } from '@/domain/logistic/enterprise/entities/order-status'

export class PrismaOrderStatusMapper {
	static toDomain(raw: PrismaOrderStatus): OrderStatus {
		return OrderStatus.create(
			{
				orderId: new UniqueEntityId(raw.orderId),
				creatorId: new UniqueEntityId(raw.creatorId),
				currentLocationId: raw.currentLocationId
					? new UniqueEntityId(raw.currentLocationId)
					: undefined,
				statusCode: raw.statusCode,
				details: raw.details ?? undefined,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(status: OrderStatus): Prisma.StatusUncheckedCreateInput {
		return {
			id: status.id.toString(),
			creatorId: status.creatorId.toString(),
			currentLocationId: status.currentLocationId?.toString() ?? null,
			orderId: status.orderId.toString(),
			details: status.details,
			statusCode: status.statusCode,
			updatedAt: status.updatedAt ?? undefined,
		}
	}
}
