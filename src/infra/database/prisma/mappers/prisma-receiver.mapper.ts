import { Prisma, Receiver as PrismaReceiver } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Receiver } from '@/domain/logistic/enterprise/entities/receiver'

export class PrismaReceiverMapper {
	static toDomain(raw: PrismaReceiver): Receiver {
		return Receiver.create(
			{
				name: raw.name,
				documentNumber: raw.documentNumber,
				phone: raw.phone,
				email: raw.email,
				address: raw.address,
				city: raw.city,
				state: raw.state,
				neighborhood: raw.neighborhood,
				zipCode: raw.zipCode,
				deletedAt: raw.deletedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(receiver: Receiver): Prisma.ReceiverUncheckedCreateInput {
		return {
			id: receiver.id.toString(),
			name: receiver.name,
			documentNumber: receiver.documentNumber,
			phone: receiver.phone,
			email: receiver.email,
			address: receiver.address,
			city: receiver.city,
			state: receiver.state,
			neighborhood: receiver.neighborhood,
			zipCode: receiver.zipCode,
			deletedAt: receiver.deletedAt,
		}
	}
}
