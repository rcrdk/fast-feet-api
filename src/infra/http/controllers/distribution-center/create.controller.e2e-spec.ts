import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('create distribution center (e2e)', () => {
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

	test('[POST] /distribution-centers', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const response = await request(app.getHttpServer())
			.post('/distribution-centers')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				name: 'John Doe Carrier',
				city: 'Timbó',
				state: 'SC',
			})

		expect(response.statusCode).toEqual(201)
		const dcOnDatabase = await prisma.distributionCenter.findFirst({
			where: {
				name: 'John Doe Carrier',
				city: 'Timbó',
				state: 'SC',
			},
		})
		expect(dcOnDatabase).toBeTruthy()
	})
})
