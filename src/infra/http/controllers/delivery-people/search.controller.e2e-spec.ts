import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('search delivery person (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let deliveryPersonFactory: DeliveryPersonFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [DeliveryPersonFactory, AdministratorFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)

		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /delivery-people/search', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		await deliveryPersonFactory.makeDeliveryPerson({
			name: 'John Doe',
			documentNumber: '999.999.999-99',
			email: 'john@doe.com',
			phone: '(99) 9999-9999',
			city: 'Timbó',
			state: 'SC',
		})

		await deliveryPersonFactory.makeDeliveryPerson({
			name: 'Janet Doe',
			documentNumber: '888.888.888-888',
			email: 'janet@doe.com',
			phone: '(99) 9999-9999',
			city: 'Curitiba',
			state: 'PR',
		})

		await deliveryPersonFactory.makeDeliveryPerson({
			name: 'Joe John',
			documentNumber: '777.888.888-888',
			email: 'joe@joe.com',
			phone: '(99) 9999-9999',
			city: 'Porto Alegre',
			state: 'RS',
		})

		const responseOne = await request(app.getHttpServer())
			.get('/delivery-people/search')
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				query: 'Doe',
				limit: 5,
			})
			.send()

		expect(responseOne.statusCode).toEqual(200)
		expect(responseOne.body.deliveryPeople).toHaveLength(2)

		const responseTwo = await request(app.getHttpServer())
			.get('/delivery-people/search')
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				query: 'SC',
				limit: 5,
			})
			.send()

		expect(responseTwo.statusCode).toEqual(200)
		expect(responseTwo.body.deliveryPeople).toHaveLength(1)
	})
})
