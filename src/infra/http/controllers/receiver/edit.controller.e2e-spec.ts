import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { ReceiverFactory } from 'test/factories/make-receiver'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('edit receiver (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let receiverFactory: ReceiverFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [AdministratorFactory, ReceiverFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		receiverFactory = moduleRef.get(ReceiverFactory)

		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[PUT] /receivers/:receiverId', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const newReceiver = await receiverFactory.makePrismaReceiver()

		const response = await request(app.getHttpServer())
			.put(`/receivers/${newReceiver.id.toString()}`)
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

		expect(response.statusCode).toEqual(200)

		const receiverOnDatabase = await prisma.receiver.findUnique({
			where: {
				id: newReceiver.id.toString(),
			},
		})

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
