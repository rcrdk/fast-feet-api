import { User as PrismaUser } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeliveryPersonDetails } from '@/domain/logistic/enterprise/entities/value-objects/delivery-person-details'

export class PrismaDeliveryPersonDetailsMapper {
	static toDomain(raw: PrismaUser): DeliveryPersonDetails {
		return DeliveryPersonDetails.create({
			personId: new UniqueEntityId(raw.id),
			role: raw.role ?? 'DELIVERY_PERSON',
			name: raw.name,
			documentNumber: raw.documentNumber,
			email: raw.email,
			phone: raw.phone,
			city: raw.city,
			state: raw.state,
			deletedAt: raw.deletedAt,
		})
	}
}
