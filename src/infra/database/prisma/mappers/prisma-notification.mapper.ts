import { Notification as PrismaNotification, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class PrismaNotificationMapper {
	static toDomain(raw: PrismaNotification): Notification {
		return Notification.create(
			{
				title: raw.title,
				content: raw.content,
				recipientId: new UniqueEntityId(raw.recipientId),
				createdAt: raw.createdAt,
				readAt: raw.readAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(
		notification: Notification,
	): Prisma.NotificationUncheckedCreateInput {
		return {
			id: notification.id.toString(),
			recipientId: notification.recipientId.toString(),
			title: notification.title,
			content: notification.content,
			createdAt: notification.createdAt,
			readAt: notification.readAt,
		}
	}
}
