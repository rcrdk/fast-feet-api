import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('upload attachemnt (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [AdministratorFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		administratorFactory = moduleRef.get(AdministratorFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[POST] /attachments', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ sub: user.id.toString(), role: user.role })

		const response = await request(app.getHttpServer())
			.post('/attachments')
			.set('Authorization', `Bearer ${accessToken}`)
			.attach('file', './test/e2e/sample.jpeg')

		expect(response.statusCode).toEqual(201)
		expect(response.body).toEqual({
			attachmentId: expect.any(String),
		})
	})
})
