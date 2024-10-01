import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('edit delivery person (e2e)', () => {
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

	test('[PUT] /delivery-people/:personId', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const newPerson = await deliveryPersonFactory.makeDeliveryPerson({
			documentNumber: '000.000.000-00',
			email: 'email@email.com',
			password: await hash('123456', 8),
		})

		const response = await request(app.getHttpServer())
			.put(`/delivery-people/${newPerson.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				name: 'Jack Joe Does Not',
				documentNumber: '000.000.000-00',
				email: 'email@email.com',
				password: '12345',
				phone: '(66) 6666-6666',
				city: 'Porto Alegre',
				state: 'RS',
			})

		expect(response.statusCode).toEqual(200)

		const userOnDatabase = await prisma.user.findUnique({
			where: {
				documentNumber: '000.000.000-00',
				email: 'email@email.com',
				role: 'DELIVERY_PERSON',
			},
		})

		expect(userOnDatabase).toBeTruthy()
		expect(userOnDatabase).toMatchObject({
			name: 'Jack Joe Does Not',
			documentNumber: '000.000.000-00',
			email: 'email@email.com',
			phone: '(66) 6666-6666',
			city: 'Porto Alegre',
			state: 'RS',
		})
	})
})
