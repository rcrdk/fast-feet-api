import { Module } from '@nestjs/common'

import { AdministratorRepository } from '@/domain/logistic/application/repositories/administrator.repository'
import { AttachmentsRepository } from '@/domain/logistic/application/repositories/attachments.repository'
import { DeliveryPersonRepository } from '@/domain/logistic/application/repositories/delivery-person.repository'
import { DistributionCenterRepository } from '@/domain/logistic/application/repositories/distribution-center.repository'
import { OrderRepository } from '@/domain/logistic/application/repositories/order.repository'
import { OrderStatusRepository } from '@/domain/logistic/application/repositories/order-status.repository'
import { ReceiverRepository } from '@/domain/logistic/application/repositories/receiver.repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications.repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAdministratorRepository } from './prisma/repositories/prisma-administrator.repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments.repository'
import { PrismaDeliveryPersonRepository } from './prisma/repositories/prisma-delivery-person.repository'
import { PrismaDistributionCenterRepository } from './prisma/repositories/prisma-distribution-center.repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications.repository'
import { PrismaOrderRepository } from './prisma/repositories/prisma-order.repository'
import { PrismaOrderStatusRepository } from './prisma/repositories/prisma-order-status.repository'
import { PrismaReceiverRepository } from './prisma/repositories/prisma-receivers.repository'

@Module({
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
		{
			provide: ReceiverRepository,
			useClass: PrismaReceiverRepository,
		},
		{
			provide: OrderRepository,
			useClass: PrismaOrderRepository,
		},
		{
			provide: OrderStatusRepository,
			useClass: PrismaOrderStatusRepository,
		},
		{
			provide: AttachmentsRepository,
			useClass: PrismaAttachmentsRepository,
		},
		{
			provide: NotificationsRepository,
			useClass: PrismaNotificationsRepository,
		},
	],
	exports: [
		PrismaService,
		AdministratorRepository,
		DeliveryPersonRepository,
		DistributionCenterRepository,
		ReceiverRepository,
		OrderRepository,
		AttachmentsRepository,
		NotificationsRepository,
	],
})
export class DatabaseModule {}
