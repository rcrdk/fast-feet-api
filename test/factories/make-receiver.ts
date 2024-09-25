import { faker, fakerPT_BR as fakerBrazilian } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	Receiver,
	ReceiverProps,
} from '@/domain/logistic/enterprise/entities/receiver'

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

// @Injectable()
// export class StudentFactory {
// 	constructor(private prisma: PrismaService) {}

// 	async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
// 		const student = makeStudent(data)

// 		await this.prisma.user.create({
// 			data: PrismaStudentMapper.toPrisma(student),
// 		})

// 		return student
// 	}
// }
