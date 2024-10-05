import { Module } from '@nestjs/common'

import { OnOrderStatusChanged } from '@/domain/notification/application/subscribers/on-order-status-changed'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

import { DatabaseModule } from '../database/database.module'

@Module({
	imports: [DatabaseModule],
	providers: [OnOrderStatusChanged, SendNotificationUseCase],
})
export class EventsModule {}
