import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('view delivery person (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let deliveryPersonFactory: DeliveryPersonFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [DeliveryPersonFactory, AdministratorFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)

		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /delivery-people/:personId', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const newPerson = await deliveryPersonFactory.makeDeliveryPerson({
			name: 'John Doe',
			documentNumber: '999.999.999-99',
			email: 'john@doe.com',
			phone: '(99) 9999-9999',
			city: 'Timbó',
			state: 'SC',
		})

		const response = await request(app.getHttpServer())
			.get(`/delivery-people/${newPerson.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toEqual(200)

		const userOnDatabase = await prisma.user.findUnique({
			where: {
				documentNumber: newPerson.documentNumber,
				email: newPerson.email,
			},
		})

		expect(userOnDatabase).toMatchObject({
			name: 'John Doe',
			documentNumber: '999.999.999-99',
			email: 'john@doe.com',
			phone: '(99) 9999-9999',
			city: 'Timbó',
			state: 'SC',
		})
	})
})
