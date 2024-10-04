import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person'

import { HashComparer } from '@/domain/logistic/application/cryptography/hash-comparer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('change delivery person password (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let deliveryPersonFactory: DeliveryPersonFactory
	let prisma: PrismaService
	let jwt: JwtService
	let hasherComparer: HashComparer

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
		hasherComparer = moduleRef.get(HashComparer)

		await app.init()
	})

	test('[PATCH] /delivery-people/:personId/set-password', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const oldPassword = '123456'
		const newPassword = '987654'

		const person = await deliveryPersonFactory.makeDeliveryPerson({
			password: await hash(oldPassword, 8),
		})

		const response = await request(app.getHttpServer())
			.patch(`/delivery-people/${person.id}/set-password`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				password: newPassword,
			})

		expect(response.statusCode).toEqual(204)

		const userOnDatabase = await prisma.user.findUnique({
			where: {
				id: person.id.toString(),
			},
		})

		const isNewPasswordMatches = await hasherComparer.compare(
			newPassword,
			userOnDatabase?.password ?? '',
		)

		expect(isNewPasswordMatches).toBeTruthy()

		const isOldPasswordMatches = await hasherComparer.compare(
			oldPassword,
			userOnDatabase?.password ?? '',
		)

		expect(isOldPasswordMatches).toBeFalsy()
	})
})
