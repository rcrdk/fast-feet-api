import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DistributionCenterFactory } from 'test/factories/make-distribution-center'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('view distribution center (e2e)', () => {
	let app: INestApplication
	let administratorFactory: AdministratorFactory
	let distributionCenterFactory: DistributionCenterFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [DistributionCenterFactory, AdministratorFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		administratorFactory = moduleRef.get(AdministratorFactory)
		distributionCenterFactory = moduleRef.get(DistributionCenterFactory)

		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /distribution-centers/view/:distributionCenterId', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		const newDC = await distributionCenterFactory.makePrismaDistributionCenter({
			name: 'John Doe',
			city: 'Timbó',
			state: 'SC',
		})

		const response = await request(app.getHttpServer())
			.get(`/distribution-centers/view/${newDC.id}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.distributionCenter).toMatchObject({
			distributionCenterId: newDC.id.toString(),
			name: 'John Doe',
			city: 'Timbó',
			state: 'SC',
		})
	})
})
