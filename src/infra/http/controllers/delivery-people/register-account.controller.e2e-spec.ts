import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('create delivery person account (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [AdministratorFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)

		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[POST] /delivery-people', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const response = await request(app.getHttpServer())
			.post('/delivery-people')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				name: 'John Doe',
				documentNumber: '999.999.999-99',
				password: '123456',
				email: 'john@doe.com',
				phone: '(99) 9999-9999',
				city: 'Timbó',
				state: 'SC',
			})

		expect(response.statusCode).toEqual(201)
		const userOnDatabase = await prisma.user.findUnique({
			where: {
				documentNumber: '999.999.999-99',
				email: 'john@doe.com',
			},
		})
		expect(userOnDatabase).toBeTruthy()
	})
})
