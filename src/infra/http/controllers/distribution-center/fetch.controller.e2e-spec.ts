import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DistributionCenterFactory } from 'test/factories/make-distribution-center'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('fetch distribution centers (e2e)', () => {
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

	test('[GET] /distribution-centers/fetch', async () => {
		const user = await administratorFactory.makePrismaAdministrator()
		const accessToken = jwt.sign({ role: user.role, sub: user.id.toString() })

		await distributionCenterFactory.makePrismaDistributionCenter({
			name: 'John Doe',
			city: 'Timbó',
			state: 'SC',
		})

		await distributionCenterFactory.makePrismaDistributionCenter({
			name: 'Janet Doe',
			city: 'Curitiba',
			state: 'PR',
		})

		await distributionCenterFactory.makePrismaDistributionCenter({
			name: 'Joe John',
			city: 'Porto Alegre',
			state: 'RS',
			deletedAt: new Date(),
		})

		const responseOne = await request(app.getHttpServer())
			.get('/distribution-centers/fetch')
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				query: 'Doe',
				deleted: 'false',
				page: 1,
				perPage: 20,
			})
			.send()

		expect(responseOne.statusCode).toEqual(200)
		expect(responseOne.body.data).toHaveLength(2)

		const responseTwo = await request(app.getHttpServer())
			.get('/distribution-centers/fetch')
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				query: 'Joe',
				deleted: 'true',
				page: 1,
				perPage: 20,
			})
			.send()

		expect(responseTwo.statusCode).toEqual(200)
		expect(responseTwo.body.data).toHaveLength(1)
	})
})