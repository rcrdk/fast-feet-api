import { Module } from '@nestjs/common'

import { AdministratorRepository } from '@/domain/logistic/application/repositories/administrator.repository'
import { DeliveryPersonRepository } from '@/domain/logistic/application/repositories/delivery-person.repository'

import { CacheModule } from '../cache/cache.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAdministratorRepository } from './prisma/repositories/prisma-administrator.repository'
import { PrismaDeliveryPersonRepository } from './prisma/repositories/prisma-delivery-person.repository'

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
	],
	exports: [PrismaService, AdministratorRepository, DeliveryPersonRepository],
})
export class DatabaseModule {}
