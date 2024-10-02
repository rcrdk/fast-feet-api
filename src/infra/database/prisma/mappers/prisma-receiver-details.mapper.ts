import { Receiver as PrismaReceiver } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ReceiverDetails } from '@/domain/logistic/enterprise/entities/value-objects/receiver-details'

export class PrismaReceiverDetailsMapper {
	static toDomain(raw: PrismaReceiver): ReceiverDetails {
		return ReceiverDetails.create({
			receiverId: new UniqueEntityId(raw.id),
			name: raw.name,
			documentNumber: raw.documentNumber,
			phone: raw.phone,
			email: raw.email,
			address: raw.address,
			city: raw.city,
			state: raw.state,
			neighborhood: raw.neighborhood,
			zipCode: raw.zipCode,
			reference: raw.reference,
			deletedAt: raw.deletedAt,
		})
	}
}
