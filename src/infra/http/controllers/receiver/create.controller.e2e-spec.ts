import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('create receiver (e2e)', () => {
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

	test('[POST] /receivers', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const response = await request(app.getHttpServer())
			.post('/receivers')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				name: 'John Doe',
				documentNumber: '000.000.000-00',
				phone: '(00) 0000-0000',
				email: 'email@email.com',
				address: 'Rua Lorem Ipsum',
				city: 'Timbó',
				state: 'SC',
				neighborhood: 'Centro',
				zipCode: '00000-000',
			})

		expect(response.statusCode).toEqual(201)

		const receiverOnDatabase = await prisma.receiver.findFirst()

		expect(receiverOnDatabase).toBeTruthy()
		expect(receiverOnDatabase).toMatchObject({
			name: 'John Doe',
			documentNumber: '000.000.000-00',
			phone: '(00) 0000-0000',
			email: 'email@email.com',
			address: 'Rua Lorem Ipsum',
			city: 'Timbó',
			state: 'SC',
			neighborhood: 'Centro',
			zipCode: '00000-000',
		})
	})
})
