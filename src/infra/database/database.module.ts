import { Module } from '@nestjs/common'

import { AdministratorRepository } from '@/domain/logistic/application/repositories/administrator.repository'
import { DeliveryPersonRepository } from '@/domain/logistic/application/repositories/delivery-person.repository'
import { DistributionCenterRepository } from '@/domain/logistic/application/repositories/distribution-center.repository'

import { CacheModule } from '../cache/cache.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAdministratorRepository } from './prisma/repositories/prisma-administrator.repository'
import { PrismaDeliveryPersonRepository } from './prisma/repositories/prisma-delivery-person.repository'
import { PrismaDistributionCenterRepository } from './prisma/repositories/prisma-distribution-center.repository'

@Module({
	imports: [CacheModule],
	providers: [
		PrismaService,
		{
			provide: AdministratorRepository,
			useClass: PrismaAdministratorRepository,
		},
		{
			provide: DeliveryPersonRepository,
			useClass: PrismaDeliveryPersonRepository,
		},
		{
			provide: DistributionCenterRepository,
			useClass: PrismaDistributionCenterRepository,
		},
	],
	exports: [
		PrismaService,
		AdministratorRepository,
		DeliveryPersonRepository,
		DistributionCenterRepository,
	],
})
export class DatabaseModule {}
