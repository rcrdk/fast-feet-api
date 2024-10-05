import { Injectable } from '@nestjs/common'

import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications.repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

import { PrismaNotificationMapper } from '../mappers/prisma-notification.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
	constructor(private prisma: PrismaService) {}

	async findById(id: string) {
		const notification = await this.prisma.notification.findUnique({
			where: {
				id,
			},
		})

		if (!notification) {
			return null
		}

		return PrismaNotificationMapper.toDomain(notification)
	}

	async create(notification: Notification) {
		const data = PrismaNotificationMapper.toPrisma(notification)

		await this.prisma.notification.create({
			data,
		})
	}

	async save(notification: Notification) {
		const data = PrismaNotificationMapper.toPrisma(notification)

		await this.prisma.notification.update({
			where: { id: data.id },
			data,
		})
	}
}
