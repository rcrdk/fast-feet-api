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

describe('view order details (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let deliveryPersonFactory: DeliveryPersonFactory
	let receiverFactory: ReceiverFactory
	let distributionCenterFactory: DistributionCenterFactory
	let orderFactory: OrderFactory
	let orderStatusFactory: OrderStatusFactory
	let attachmentFactory: AttachmentFactory
	let jwt: JwtService
	let prisma: PrismaService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				DeliveryPersonFactory,
				AdministratorFactory,
				ReceiverFactory,
				DistributionCenterFactory,
				OrderFactory,
				OrderStatusFactory,
				AttachmentFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory)
		receiverFactory = moduleRef.get(ReceiverFactory)
		distributionCenterFactory = moduleRef.get(DistributionCenterFactory)
		orderFactory = moduleRef.get(OrderFactory)
		orderStatusFactory = moduleRef.get(OrderStatusFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)

		jwt = moduleRef.get(JwtService)
		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	test('[GET] /orders/view/:orderId', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const receiver = await receiverFactory.makePrismaReceiver()
		// eslint-disable-next-line prettier/prettier
		const distributionCenter = await distributionCenterFactory.makePrismaDistributionCenter()
		const deliveryPerson = await deliveryPersonFactory.makeDeliveryPerson()

		const newOrder = await orderFactory.makePrismaOrder({
			creatorId: user.id,
			originLocationId: distributionCenter.id,
			currentLocationId: distributionCenter.id,
			receiverId: receiver.id,
			deliveryPersonId: deliveryPerson.id,
		})

		const id = newOrder.id.toString()

		const newStatus = await orderStatusFactory.makePrismaOrderStatus({
			orderId: newOrder.id,
			creatorId: deliveryPerson.id,
			details: 'Lorem ipsum',
			updatedAt: new Date(),
			statusCode: 'PICKED',
			currentLocationId: distributionCenter.id,
		})

		const attachment = await attachmentFactory.makePrismaAttachment()

		await prisma.attachment.update({
			where: {
				id: attachment.id.toString(),
			},
			data: {
				orderStatusId: newStatus.id.toString(),
			},
		})

		const response = await request(app.getHttpServer())
			.get(`/orders/view/${id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toEqual(200)

		expect(response.body.order).toMatchObject({
			currentStatus: 'POSTED',
			creatorName: user.name,
			originLocation: expect.objectContaining({
				name: distributionCenter.name,
			}),
			deliveryPerson: expect.objectContaining({
				name: deliveryPerson.name,
			}),
			receiver: expect.objectContaining({
				name: receiver.name,
			}),
			status: expect.arrayContaining([
				expect.objectContaining({
					statusCode: 'PICKED',
					details: 'Lorem ipsum',
					creatorName: deliveryPerson.name,
					attachment: expect.objectContaining({
						attachmentId: attachment.id.toString(),
						url: attachment.url,
					}),
					currentLocation: expect.objectContaining({
						name: distributionCenter.name,
					}),
				}),
			]),
		})
	})
})
