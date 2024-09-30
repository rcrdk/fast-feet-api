import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Administrator } from '@/domain/logistic/enterprise/entities/administrator'

export class PrismaAdministratorMapper {
	static toDomain(raw: PrismaUser): Administrator {
		return Administrator.create(
			{
				name: raw.name,
				email: raw.email,
				password: raw.password,
				documentNumber: raw.documentNumber,
				phone: raw.phone,
				city: raw.city,
				state: raw.state,
				role: 'ADMINISTRATOR',
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(
		administrator: Administrator,
	): Prisma.UserUncheckedCreateInput {
		return {
			id: administrator.id.toString(),
			name: administrator.name,
			email: administrator.email,
			password: administrator.password,
			city: administrator.city,
			state: administrator.state,
			documentNumber: administrator.documentNumber,
			phone: administrator.phone,
			role: administrator.role,
		}
	}
}
