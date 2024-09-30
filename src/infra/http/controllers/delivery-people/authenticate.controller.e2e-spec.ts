import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('authenticate delivery person (e2e)', () => {
	let app: INestApplication
	let deliveryPersonFactory: DeliveryPersonFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [DeliveryPersonFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)

		await app.init()
	})

	test('[POST] /delivery-people/session', async () => {
		await deliveryPersonFactory.makeDeliveryPerson({
			documentNumber: '000.000.000-00',
			password: await hash('123456', 8),
		})

		const response = await request(app.getHttpServer())
			.post('/delivery-people/session')
			.send({
				documentNumber: '000.000.000-00',
				password: '123456',
			})

		expect(response.statusCode).toEqual(201)
		expect(response.body).toEqual({
			access_token: expect.any(String),
		})
	})
})
