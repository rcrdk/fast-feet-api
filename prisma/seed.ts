import { fakerPT_BR as fakerBrazilian } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	const administrator = await prisma.user.create({
		data: {
			name: fakerBrazilian.person.fullName(),
			documentNumber: '999.999.999-99',
			role: 'ADMINISTRATOR',
			phone: fakerBrazilian.phone.number(),
			email: fakerBrazilian.internet.email(),
			password: await hash('12345', 8),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state(),
		},
	})

	const deliveryPerson = await prisma.user.create({
		data: {
			name: fakerBrazilian.person.fullName(),
			documentNumber: '666.666.666-66',
			role: 'DELIVERY_PERSON',
			phone: fakerBrazilian.phone.number(),
			email: fakerBrazilian.internet.email(),
			password: await hash('12345', 8),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state(),
		},
	})

	const distributionCenterOne = await prisma.distributionCenter.create({
		data: {
			name: fakerBrazilian.company.name(),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state(),
		},
	})

	const distributionCenterTwo = await prisma.distributionCenter.create({
		data: {
			name: fakerBrazilian.company.name(),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state(),
		},
	})

	const receiver = await prisma.receiver.create({
		data: {
			name: fakerBrazilian.person.fullName(),
			documentNumber: '000.000.000-00',
			phone: fakerBrazilian.phone.number(),
			email: fakerBrazilian.internet.email(),
			address: fakerBrazilian.location.streetAddress(),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state(),
			neighborhood: fakerBrazilian.location.secondaryAddress(),
			zipCode: fakerBrazilian.location.zipCode(),
			reference: fakerBrazilian.lorem.sentence(),
		},
	})

	const order = await prisma.order.create({
		data: {
			creatorId: administrator.id,
			receiverId: receiver.id,
			currentLocationId: distributionCenterOne.id,
			originLocationId: distributionCenterOne.id,
		},
	})

	await prisma.status.createMany({
		data: [
			{
				orderId: order.id,
				statusCode: 'POSTED',
				creatorId: administrator.id,
				currentLocationId: distributionCenterOne.id,
			},
			{
				orderId: order.id,
				statusCode: 'PICKED',
				creatorId: deliveryPerson.id,
				currentLocationId: distributionCenterOne.id,
			},
			{
				orderId: order.id,
				statusCode: 'TRANSFER_PROGRESS',
				creatorId: deliveryPerson.id,
				currentLocationId: distributionCenterTwo.id,
			},
		],
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
