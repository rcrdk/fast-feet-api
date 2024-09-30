import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeliveryPerson } from '@/domain/logistic/enterprise/entities/delivery-person'

export class PrismaDeliveryPersonMapper {
	static toDomain(raw: PrismaUser): DeliveryPerson {
		return DeliveryPerson.create(
			{
				name: raw.name,
				email: raw.email,
				password: raw.password,
				documentNumber: raw.documentNumber,
				phone: raw.phone,
				city: raw.city,
				state: raw.state,
				role: 'DELIVERY_PERSON',
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(person: DeliveryPerson): Prisma.UserUncheckedCreateInput {
		return {
			id: person.id.toString(),
			name: person.name,
			email: person.email,
			password: person.password,
			city: person.city,
			state: person.state,
			documentNumber: person.documentNumber,
			phone: person.phone,
			role: person.role,
		}
	}
}
