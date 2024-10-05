import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class NotificationPresenter {
	static toHttp(notification: Notification) {
		return {
			notificationId: notification.id.toString(),
			receipientId: notification.recipientId.toString(),
			title: notification.title,
			content: notification.content,
			createdAt: notification.createdAt,
			readAt: notification.readAt ?? null,
		}
	}
}
