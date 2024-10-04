/* eslint-disable prettier/prettier */
import {
	DistributionCenter as PrismaLocation,
	Order as PrismaOrder,
	Receiver as PrismaReceiver,
	User as PrismaUser,
} from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { SearchOrderItem } from '@/domain/logistic/enterprise/entities/value-objects/search-order-item'

type PrismaSearchOrder = PrismaOrder & {
	creator: PrismaUser
	currentLocation: PrismaLocation
	receiver: PrismaReceiver
	deliveryPerson?: PrismaUser | null
}

export class PrismaSearchOrderItemMapper {
	static toDomain(raw: PrismaSearchOrder): SearchOrderItem {
		const deliveryPerson = !raw.deliveryPerson ? null : {
			personId: new UniqueEntityId(raw.deliveryPerson.id),
			role: raw.deliveryPerson.role ?? 'DELIVERY_PERSON',
			name: raw.deliveryPerson.name,
			documentNumber: raw.deliveryPerson.documentNumber,
			email: raw.deliveryPerson.email,
			phone: raw.deliveryPerson.phone,
			city: raw.deliveryPerson.city,
			state: raw.deliveryPerson.state,
		}

		return SearchOrderItem.create({
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
			deliveryPerson,
		})
	}
}
