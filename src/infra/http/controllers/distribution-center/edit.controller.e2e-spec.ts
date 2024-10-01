import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DistributionCenterFactory } from 'test/factories/make-distribution-center'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('edit distribution center (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let distributionCenterFactory: DistributionCenterFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [AdministratorFactory, DistributionCenterFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		distributionCenterFactory = moduleRef.get(DistributionCenterFactory)

		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[PUT] /distribution-centers/:distributionCenterId', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const newDC = await distributionCenterFactory.makePrismaDistributionCenter()

		const response = await request(app.getHttpServer())
			.put(`/distribution-centers/${newDC.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				name: 'Jack Joe Does Not',
				city: 'Porto Alegre',
				state: 'RS',
			})

		expect(response.statusCode).toEqual(200)

		const dcOnDatabase = await prisma.distributionCenter.findUnique({
			where: {
				id: newDC.id.toString(),
			},
		})

		expect(dcOnDatabase).toBeTruthy()
		expect(dcOnDatabase).toMatchObject({
			name: 'Jack Joe Does Not',
			city: 'Porto Alegre',
			state: 'RS',
		})
	})
})
