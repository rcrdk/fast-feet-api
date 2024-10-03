import {
	DistributionCenter as PrismaLocation,
	Order as PrismaOrder,
	Receiver as PrismaReceiver,
	User as PrismaUser,
} from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AvailableOrderItem } from '@/domain/logistic/enterprise/entities/value-objects/available-order-item'

type PrismaAvailableOrder = PrismaOrder & {
	creator: PrismaUser
	currentLocation: PrismaLocation
	receiver: PrismaReceiver
}

export class PrismaAvailableOrderItemMapper {
	static toDomain(raw: PrismaAvailableOrder): AvailableOrderItem {
		return AvailableOrderItem.create({
			orderId: new UniqueEntityId(raw.id),
			currentStatusCode: raw.currentStatusCode,
			postedAt: raw.postedAt,
			updatedAt: raw.updatedAt,
			creator: {
				creatorId: new UniqueEntityId(raw.creator.id),
				name: raw.creator.name,
				documentNumber: raw.creator.documentNumber,
				email: raw.creator.email,
				phone: raw.creator.phone,
				city: raw.creator.city,
				state: raw.creator.state,
				role: raw.creator.role ?? 'ADMINISTRATOR',
			},
			currentLocation: {
				currentLocationId: new UniqueEntityId(raw.currentLocation.id),
				name: raw.currentLocation.name,
				city: raw.currentLocation.city,
				state: raw.currentLocation.state,
			},
			receiver: {
				receiverId: new UniqueEntityId(raw.receiver.id),
				name: raw.receiver.name,
				documentNumber: raw.receiver.documentNumber,
				phone: raw.receiver.phone,
				email: raw.receiver.email,
				address: raw.receiver.address,
				city: raw.receiver.city,
				state: raw.receiver.state,
				neighborhood: raw.receiver.neighborhood,
				zipCode: raw.receiver.zipCode,
				reference: raw.receiver.reference ?? null,
			},
		})
	}
}
