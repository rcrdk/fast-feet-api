import { fakerPT_BR as fakerBrazilian } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DistributionCenter } from '@/domain/app/enterprise/entities/distribution-center'

export function makeDistributionCenter(
	override: Partial<DistributionCenter> = {},
	id?: UniqueEntityId,
) {
	const distributionCenter = DistributionCenter.create(
		{
			name: fakerBrazilian.person.fullName(),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state({ abbreviated: true }),
			...override,
		},
		id,
	)

	return distributionCenter
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
