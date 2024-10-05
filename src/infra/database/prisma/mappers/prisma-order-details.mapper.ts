/* eslint-disable prettier/prettier */
import {
	Attachment as PrismaAttachment,
	DistributionCenter as PrismaLocation,
	Order as PrismaOrder,
	Receiver as PrismaReceiver,
	Status as PrismaStatus,
	User as PrismaUser
} from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderDetails } from '@/domain/logistic/enterprise/entities/value-objects/order-details'

type PrismaOrderDetailsStatus = PrismaStatus & {
	creator: PrismaUser
	currentLocation?: PrismaLocation | null
	attachments: PrismaAttachment[]
}

type PrismaOrderDetails = PrismaOrder & {
	creator: PrismaUser
	originLocation: PrismaLocation
	currentLocation?: PrismaLocation | null
	deliveryPerson?: PrismaUser | null
	receiver: PrismaReceiver
	orderStatus: PrismaOrderDetailsStatus[]
}

export class PrismaOrderDetailsMapper {
	static toDomain(raw: PrismaOrderDetails): OrderDetails {
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

		const currentLocation = !raw.currentLocation ? null : {
			currentLocationId: new UniqueEntityId(raw.currentLocation.id),
			name: raw.currentLocation.name,
			city: raw.currentLocation.city,
			state: raw.currentLocation.state,
		}

		return OrderDetails.create({
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
			originLocation: {
				originLocationId: new UniqueEntityId(raw.originLocation.id),
				name: raw.originLocation.name,
				city: raw.originLocation.city,
				state: raw.originLocation.state,
			},
			currentLocation,
			deliveryPerson,
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
			orderStatus: raw.orderStatus.map((status) => {
				return {
					statusCode: status.statusCode,
					details: status.details,
					updatedAt: status.updatedAt,
					creator: {
						creatorId: new UniqueEntityId(status.creator.id),
						name: status.creator.name,
						documentNumber: status.creator.documentNumber,
						email: status.creator.email,
						phone: status.creator.phone,
						city: status.creator.city,
						state: status.creator.state,
						role: status.creator.role ?? 'ADMINISTRATOR',
					},
					attachments: status.attachments.map((file) => {
						return {
							orderStatusId: file.orderStatusId ? new UniqueEntityId(file.orderStatusId) : null,
							attachmentId: new UniqueEntityId(file.id),
							url: file.url,
						}
					}),
					currentLocation: status.currentLocation ? {
						currentLocationId: new UniqueEntityId(status.currentLocation.id),
						name: status.currentLocation.name,
						city: status.currentLocation.city,
						state: status.currentLocation.state,
					} : null,
				}
			}),
		})
	}
}
