import { faker, fakerPT_BR as fakerBrazilian } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	Receiver,
	ReceiverProps,
} from '@/domain/logistic/enterprise/entities/receiver'
import { PrismaReceiverMapper } from '@/infra/database/prisma/mappers/prisma-receiver.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeReceiver(
	override: Partial<ReceiverProps> = {},
	id?: UniqueEntityId,
) {
	const person = Receiver.create(
		{
			name: fakerBrazilian.person.fullName(),
			documentNumber: '000.000.000-00',
			email: fakerBrazilian.internet.email(),
			phone: fakerBrazilian.phone.number(),
			address: fakerBrazilian.location.streetAddress(),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state({ abbreviated: true }),
			neighborhood: 'Centro',
			zipCode: fakerBrazilian.location.zipCode(),
			reference: faker.lorem.sentence(),
			...override,
		},
		id,
	)

	return person
}

@Injectable()
export class ReceiverFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaReceiver(
		data: Partial<ReceiverProps> = {},
	): Promise<Receiver> {
		const student = makeReceiver(data)

		await this.prisma.receiver.create({
			data: PrismaReceiverMapper.toPrisma(student),
		})

		return student
	}
}
