import { faker, fakerPT_BR as fakerBrazilian } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	Administrator,
	AdministratorProps,
} from '@/domain/logistic/enterprise/entities/administrator'
import { PrismaAdministratorMapper } from '@/infra/database/prisma/mappers/prisma-administrator.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

/**
 *
 * @param role
 * @returns can be setted as DELIVERY_PERSON for testing purpouses.
 */
export function makeAdministrator(
	override: Partial<AdministratorProps> = {},
	id?: UniqueEntityId,
) {
	const person = Administrator.create(
		{
			name: fakerBrazilian.person.fullName(),
			documentNumber: '000.000.000-00',
			password: faker.internet.password(),
			email: fakerBrazilian.internet.email(),
			phone: fakerBrazilian.phone.number(),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state({ abbreviated: true }),
			role: 'ADMINISTRATOR',
			...override,
		},
		id,
	)

	return person
}

@Injectable()
export class AdministratorFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAdministrator(
		data: Partial<AdministratorProps> = {},
	): Promise<Administrator> {
		const administrator = makeAdministrator(data)

		await this.prisma.user.create({
			data: PrismaAdministratorMapper.toPrisma(administrator),
		})

		return administrator
	}
}
