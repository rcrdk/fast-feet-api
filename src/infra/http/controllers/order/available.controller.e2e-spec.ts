import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DistributionCenterFactory } from 'test/factories/make-distribution-center'
import { OrderFactory } from 'test/factories/make-order'
import { ReceiverFactory } from 'test/factories/make-receiver'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('fetch available orders (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
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
			],
		}).compile()

		app = moduleRef.createNestApplication()

		orderFactory = moduleRef.get(OrderFactory)
		administratorFactory = moduleRef.get(AdministratorFactory)
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

		const { id: receiverId } = await receiverFactory.makePrismaReceiver()

		await orderFactory.makePrismaOrder({
			creatorId: user.id,
			currentStatusCode: 'POSTED',
			currentLocationId: locationIdOne,
			originLocationId: locationIdOne,
			receiverId,
		})

		await orderFactory.makePrismaOrder({
			creatorId: user.id,
			currentStatusCode: 'POSTED',
			currentLocationId: locationIdTwo,
			originLocationId: locationIdTwo,
			receiverId,
		})

		const response = await request(app.getHttpServer())
			.get('/orders/available')
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				city: 'Timbó',
				state: 'SC',
				page: 1,
				perPage: 20,
			})
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.data).toHaveLength(1)
	})
})
