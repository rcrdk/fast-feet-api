import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { ReceiverFactory } from 'test/factories/make-receiver'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('fetch receivers (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let receiverFactory: ReceiverFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [ReceiverFactory, AdministratorFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		receiverFactory = moduleRef.get(ReceiverFactory)

		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /receivers/fetch', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		await receiverFactory.makePrismaReceiver({
			name: 'John Doe',
			documentNumber: '000.000.000-00',
		})

		await receiverFactory.makePrismaReceiver({
			name: 'Janet Doe',
			documentNumber: '000.088.000-00',
		})

		await receiverFactory.makePrismaReceiver({
			name: 'Joe John',
			documentNumber: '999.000.900-00',
			deletedAt: new Date(),
		})

		const responseOne = await request(app.getHttpServer())
			.get('/receivers/fetch')
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				query: '000.0',
				deleted: 'false',
				page: 1,
				perPage: 20,
			})
			.send()

		expect(responseOne.statusCode).toEqual(200)
		expect(responseOne.body.data).toHaveLength(2)

		const responseTwo = await request(app.getHttpServer())
			.get('/receivers/fetch')
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				query: 'Joe',
				deleted: 'true',
				page: 1,
				perPage: 20,
			})
			.send()

		expect(responseTwo.statusCode).toEqual(200)
		expect(responseTwo.body.data).toHaveLength(1)
	})
})
