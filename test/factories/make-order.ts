import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/app/enterprise/entities/order'

export function makeOrder(
	override: Partial<OrderProps> = {},
	id?: UniqueEntityId,
) {
	const order = Order.create(
		{
			creatorId: new UniqueEntityId('creator-01'),
			originLocationId: new UniqueEntityId('distribution-center-01'),
			currentLocationId: new UniqueEntityId('distribution-center-01'),
			receiverId: new UniqueEntityId('receiver-01'),
			currentStatusCode: 'POSTED',
			...override,
		},
		id,
	)

	return order
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
