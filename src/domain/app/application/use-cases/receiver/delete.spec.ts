import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteReceiverUseCase } from './delete'

let inMemoryReceiverRepository: InMemoryReceiverRepository
let sut: DeleteReceiverUseCase

describe('delete receiver', () => {
	beforeEach(() => {
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		sut = new DeleteReceiverUseCase(inMemoryReceiverRepository)
	})

	it('should be able to delete a receiver', async () => {
		const newPerson = makeReceiver({}, new UniqueEntityId('person-01'))

		await inMemoryReceiverRepository.create(newPerson)

		await sut.execute({
			personId: 'person-01',
		})

		expect(inMemoryReceiverRepository.items).toHaveLength(1)
		expect(inMemoryReceiverRepository.items.at(0)).toMatchObject({
			deletedAt: expect.any(Date),
		})
	})
})
