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

describe('fetch delivery person orders (e2e)', () => {
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
				DeliveryPersonFactory,
				AdministratorFactory,
				OrderFactory,
				DistributionCenterFactory,
				ReceiverFactory,
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

	test('[GET] /delivery-people/:deliveryPersonId/orders', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const { id: deliveryPersonId } =
			await deliveryPersonFactory.makeDeliveryPerson({
				name: 'John Doe',
				documentNumber: '999.999.999-99',
				email: 'john@doe.com',
				phone: '(99) 9999-9999',
				city: 'Timbó',
				state: 'SC',
			})

		const { id: locationId } =
			await distributionCenterFactory.makePrismaDistributionCenter()

		const { id: receiverId } = await receiverFactory.makePrismaReceiver()

		await orderFactory.makePrismaOrder({
			creatorId: user.id,
			currentStatusCode: 'POSTED',
			deliveryPersonId,
			currentLocationId: locationId,
			originLocationId: locationId,
			receiverId,
		})

		const response = await request(app.getHttpServer())
			.get(`/delivery-people/${deliveryPersonId.toString()}/orders/`)
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				page: 1,
				perPage: 20,
			})
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.data).toHaveLength(1)
	})
})
