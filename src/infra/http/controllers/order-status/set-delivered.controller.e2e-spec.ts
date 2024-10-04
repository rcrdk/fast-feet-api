import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'
import { DistributionCenterFactory } from 'test/factories/make-distribution-center'
import { OrderFactory } from 'test/factories/make-order'
import { OrderStatusFactory } from 'test/factories/make-order-status'
import { ReceiverFactory } from 'test/factories/make-receiver'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('set order status as delivered (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let receiverFactory: ReceiverFactory
	let distributionCenterFactory: DistributionCenterFactory
	let deliveryPersonFactory: DeliveryPersonFactory
	let orderFactory: OrderFactory
	let orderStatusFactory: OrderStatusFactory
	let attachmentFactory: AttachmentFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				OrderFactory,
				OrderStatusFactory,
				AdministratorFactory,
				ReceiverFactory,
				DistributionCenterFactory,
				DeliveryPersonFactory,
				AttachmentFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		receiverFactory = moduleRef.get(ReceiverFactory)
		distributionCenterFactory = moduleRef.get(DistributionCenterFactory)
		deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
		orderFactory = moduleRef.get(OrderFactory)
		orderStatusFactory = moduleRef.get(OrderStatusFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)

		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[PATCH] /orders/:orderId/set-status/delivered', async () => {
		const deliveryPerson = await deliveryPersonFactory.makeDeliveryPerson()
		const accessToken = jwt.sign({
			role: deliveryPerson.role,
			sub: deliveryPerson.id.toString(),
		})

		const administrator = await administratorFactory.makePrismaAdministrator()
		const receiver = await receiverFactory.makePrismaReceiver()
		// eslint-disable-next-line prettier/prettier
		const distributionCenter = await distributionCenterFactory.makePrismaDistributionCenter()

		const order = await orderFactory.makePrismaOrder({
			creatorId: administrator.id,
			originLocationId: distributionCenter.id,
			currentLocationId: distributionCenter.id,
			receiverId: receiver.id,
		})

		await orderStatusFactory.makePrismaOrderStatus({
			creatorId: administrator.id,
			orderId: order.id,
			statusCode: 'POSTED',
			currentLocationId: distributionCenter.id,
		})

		const orderId = order.id.toString()

		const attachment = await attachmentFactory.makePrismaAttachment()

		const response = await request(app.getHttpServer())
			.patch(`/orders/${orderId}/set-status/delivered`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				deliveryPersonId: deliveryPerson.id.toString(),
				attachmentId: attachment.id.toString(),
				details: 'Lorem ipsum dolor sit amet!',
			})

		expect(response.statusCode).toEqual(204)

		const orderOnDatabase = await prisma.order.findUnique({
			where: {
				id: orderId,
			},
			include: {
				orderStatus: {
					include: {
						attachments: true,
					},
				},
			},
		})

		expect(orderOnDatabase).toBeTruthy()

		expect(orderOnDatabase).toMatchObject({
			deliveryPersonId: deliveryPerson.id.toString(),
			originLocationId: distributionCenter.id.toString(),
			currentLocationId: distributionCenter.id.toString(),
			currentStatusCode: 'DELIVERED',
		})

		expect(orderOnDatabase?.orderStatus).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					statusCode: 'POSTED',
					creatorId: administrator.id.toString(),
					currentLocationId: distributionCenter.id.toString(),
				}),
				expect.objectContaining({
					statusCode: 'DELIVERED',
					creatorId: deliveryPerson.id.toString(),
					currentLocationId: distributionCenter.id.toString(),
					details: 'Lorem ipsum dolor sit amet!',
					attachments: expect.arrayContaining([
						expect.objectContaining({
							url: expect.any(String),
							orderStatusId: expect.any(String),
						}),
					]),
				}),
			]),
		)
	})
})
