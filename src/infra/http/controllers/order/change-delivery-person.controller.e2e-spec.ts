import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import { DistributionCenterFactory } from 'test/factories/make-distribution-center'
import { OrderFactory } from 'test/factories/make-order'
import { ReceiverFactory } from 'test/factories/make-receiver'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('change order delivery person (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let receiverFactory: ReceiverFactory
	let distributionCenterFactory: DistributionCenterFactory
	let deliveryPersonFactory: DeliveryPersonFactory
	let orderFactory: OrderFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				OrderFactory,
				AdministratorFactory,
				ReceiverFactory,
				DistributionCenterFactory,
				DeliveryPersonFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		receiverFactory = moduleRef.get(ReceiverFactory)
		distributionCenterFactory = moduleRef.get(DistributionCenterFactory)
		deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
		orderFactory = moduleRef.get(OrderFactory)

		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[PATCH] /orders/:orderId/set-delivery-person', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const receiver = await receiverFactory.makePrismaReceiver()
		// eslint-disable-next-line prettier/prettier
		const distributionCenter = await distributionCenterFactory.makePrismaDistributionCenter()
		const deliveryPerson = await deliveryPersonFactory.makeDeliveryPerson()

		const newOrder = await orderFactory.makePrismaOrder({
			creatorId: user.id,
			originLocationId: distributionCenter.id,
			currentLocationId: distributionCenter.id,
			receiverId: receiver.id,
		})

		const id = newOrder.id.toString()

		const response = await request(app.getHttpServer())
			.patch(`/orders/${id}/set-delivery-person`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				deliveryPersonId: deliveryPerson.id.toString(),
			})

		expect(response.statusCode).toEqual(204)

		const orderOnDatabase = await prisma.order.findFirst()

		expect(orderOnDatabase).toBeTruthy()
		expect(orderOnDatabase).toMatchObject({
			deliveryPersonId: deliveryPerson.id.toString(),
		})
	})
})
