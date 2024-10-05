import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository'

import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('send notification', () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
	})

	it('should be able to send a notification', async () => {
		const result = await sut.execute({
			recipientId: 'author-01',
			title: 'Que dia é hoje?',
			content: 'Amnésia pura',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationsRepository.items.at(0)).toEqual(
			result.value?.notification,
		)
	})
})
