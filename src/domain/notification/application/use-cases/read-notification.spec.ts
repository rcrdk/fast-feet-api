import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository'

import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('read notification', () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
	})

	it('should be able to read a notification', async () => {
		const notification = makeNotification()

		await inMemoryNotificationsRepository.create(notification)

		const result = await sut.execute({
			notificationId: notification.id.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationsRepository.items.at(0)?.readAt).toEqual(
			expect.any(Date),
		)
	})
})
