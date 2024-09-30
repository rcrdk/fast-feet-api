import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('authenticate administrator (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [AdministratorFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)

		await app.init()
	})

	test('[POST] /administrators/session', async () => {
		await administratorFactory.makePrismaAdministrator({
			documentNumber: '000.000.000-00',
			password: await hash('123456', 8),
		})

		const response = await request(app.getHttpServer())
			.post('/administrators/session')
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
