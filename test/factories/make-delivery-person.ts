import { faker, fakerPT_BR as fakerBrazilian } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	DeliveryPerson,
	DeliveryPersonProps,
} from '@/domain/logistic/enterprise/entities/delivery-person'

/**
 *
 * @param role
 * @returns can be setted as ADMIN for testing purpouses.
 */
export function makeDeliveryPerson(
	override: Partial<DeliveryPersonProps> = {},
	id?: UniqueEntityId,
) {
	const person = DeliveryPerson.create(
		{
			name: fakerBrazilian.person.fullName(),
			documentNumber: '000.000.000-00',
			password: faker.internet.password(),
			email: fakerBrazilian.internet.email(),
			phone: fakerBrazilian.phone.number(),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state({ abbreviated: true }),
			role: 'DELIVERY_PERSON',
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
