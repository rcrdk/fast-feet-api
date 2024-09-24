import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ViewReceiverUseCase } from './view'

let inMemoryReceiverRepository: InMemoryReceiverRepository
let sut: ViewReceiverUseCase

describe('view receiver', () => {
	beforeEach(() => {
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		sut = new ViewReceiverUseCase(inMemoryReceiverRepository)
	})

	it('should be able to view a receiver', async () => {
		const newPerson = makeReceiver({}, new UniqueEntityId('person-01'))

		await inMemoryReceiverRepository.create(newPerson)

		const response = await sut.execute({
			personId: 'person-01',
		})

		expect(response.isRight()).toBe(true)
		expect(response.value).toEqual({
			receiver: expect.objectContaining({
				id: expect.any(UniqueEntityId),
			}),
		})
	})
})
