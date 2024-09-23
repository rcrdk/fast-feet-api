import { faker, fakerPT_BR as fakerBrazilian } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	Administrator,
	AdministratorProps,
} from '@/domain/app/enterprise/entities/administrator'

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
			name: faker.person.fullName(),
			documentNumber: '000.000.000-00',
			password: faker.internet.password(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state({ abbreviated: true }),
			role: 'ADMINISTRATOR',
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
