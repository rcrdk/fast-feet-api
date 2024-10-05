import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { NotificationFactory } from 'test/factories/make-notification'
import { ReceiverFactory } from 'test/factories/make-receiver'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('read notification (e2e)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let administratorFactory: AdministratorFactory
	let receiverFactory: ReceiverFactory
	let notificationFactory: NotificationFactory

	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [AdministratorFactory, NotificationFactory, ReceiverFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		administratorFactory = moduleRef.get(AdministratorFactory)
		notificationFactory = moduleRef.get(NotificationFactory)
		receiverFactory = moduleRef.get(ReceiverFactory)

		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[PATCH] /notifications/:notificationId/read', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const receiver = await receiverFactory.makePrismaReceiver()

		const notification = await notificationFactory.makePrismaNotification({
			recipientId: receiver.id,
		})

		const response = await request(app.getHttpServer())
			.patch(`/notifications/${notification.id.toString()}/read`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toEqual(200)

		const notificationsOnDatabase = await prisma.notification.findFirst({
			where: {
				recipientId: receiver.id.toString(),
			},
		})

		expect(notificationsOnDatabase?.readAt).not.toBeNull()
	})
})
