import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

import { NotificationsRepository } from '../repositories/notifications.repository'

interface ReadNotificationUseCaseRequest {
	notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	{
		notification: Notification
	}
>

@Injectable()
export class ReadNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		notificationId,
	}: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
		const notification =
			await this.notificationsRepository.findById(notificationId)

		if (!notification) {
			return left(new ResourceNotFoundError())
		}

		notification.read()

		await this.notificationsRepository.save(notification)

		return right({ notification })
	}
}
