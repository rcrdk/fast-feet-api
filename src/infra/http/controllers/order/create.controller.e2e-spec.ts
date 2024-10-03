import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DistributionCenterFactory } from 'test/factories/make-distribution-center'
import { ReceiverFactory } from 'test/factories/make-receiver'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('create order (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let receiverFactory: ReceiverFactory
	let distributionCenterFactory: DistributionCenterFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				AdministratorFactory,
				ReceiverFactory,
				DistributionCenterFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		receiverFactory = moduleRef.get(ReceiverFactory)
		distributionCenterFactory = moduleRef.get(DistributionCenterFactory)

		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[POST] /orders', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const receiver = await receiverFactory.makePrismaReceiver()
		// eslint-disable-next-line prettier/prettier
		const distributionCenter = await distributionCenterFactory.makePrismaDistributionCenter()

		const response = await request(app.getHttpServer())
			.post('/orders')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				receiverId: receiver.id.toString(),
				originDistributionCenterId: distributionCenter.id.toString(),
			})

		expect(response.statusCode).toEqual(201)

		const orderOnDatabase = await prisma.order.findFirst({
			include: {
				orderStatus: true,
			},
		})

		expect(orderOnDatabase).toBeTruthy()
		expect(orderOnDatabase).toMatchObject({
			currentStatusCode: 'POSTED',
			creatorId: user.id.toString(),
			receiverId: receiver.id.toString(),
			deliveryPersonId: null,
			originLocationId: distributionCenter.id.toString(),
			currentLocationId: distributionCenter.id.toString(),
			orderStatus: expect.arrayContaining([
				expect.objectContaining({
					statusCode: 'POSTED',
					creatorId: user.id.toString(),
					currentLocationId: distributionCenter.id.toString(),
				}),
			]),
		})
	})
})
