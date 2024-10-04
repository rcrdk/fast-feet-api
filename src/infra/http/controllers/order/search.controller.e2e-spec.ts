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

describe('search orders (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let deliveryPersonFactory: DeliveryPersonFactory
	let orderFactory: OrderFactory
	let distributionCenterFactory: DistributionCenterFactory
	let receiverFactory: ReceiverFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				AdministratorFactory,
				OrderFactory,
				DistributionCenterFactory,
				ReceiverFactory,
				DeliveryPersonFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()

		orderFactory = moduleRef.get(OrderFactory)
		administratorFactory = moduleRef.get(AdministratorFactory)
		deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
		distributionCenterFactory = moduleRef.get(DistributionCenterFactory)
		receiverFactory = moduleRef.get(ReceiverFactory)

		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /orders/available', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const { id: locationIdOne } =
			await distributionCenterFactory.makePrismaDistributionCenter({
				city: 'Blumenau',
				state: 'SC',
			})
		const { id: locationIdTwo } =
			await distributionCenterFactory.makePrismaDistributionCenter({
				city: 'Timbó',
				state: 'SC',
			})

		const { id: receiverIdOne } = await receiverFactory.makePrismaReceiver()
		const { id: receiverIdTwo } = await receiverFactory.makePrismaReceiver()

		const deliveryPerson = await deliveryPersonFactory.makeDeliveryPerson()

		await orderFactory.makePrismaOrder({
			creatorId: user.id,
			currentStatusCode: 'POSTED',
			currentLocationId: locationIdOne,
			originLocationId: locationIdOne,
			receiverId: receiverIdOne,
			deliveryPersonId: deliveryPerson.id,
		})

		await orderFactory.makePrismaOrder({
			creatorId: user.id,
			currentStatusCode: 'DELIVERED',
			currentLocationId: locationIdTwo,
			originLocationId: locationIdTwo,
			receiverId: receiverIdTwo,
			deliveryPersonId: undefined,
		})

		const response = await request(app.getHttpServer())
			.get('/orders/search')
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				deliveryPersonId: deliveryPerson.id.toString(),
				currentLocationId: locationIdOne.toString(),
				receiverId: receiverIdOne.toString(),
				currentStatusCode: 'POSTED',
				updatedFrom: new Date(),
				updatedUntil: new Date(),
				page: 1,
				perPage: 20,
			})
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.data).toHaveLength(1)
	})
})
