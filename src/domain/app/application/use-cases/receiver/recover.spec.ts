import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { RecoverReceiverUseCase } from './recover'

let inMemoryReceiverRepository: InMemoryReceiverRepository
let sut: RecoverReceiverUseCase

describe('recover receiver', () => {
	beforeEach(() => {
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		sut = new RecoverReceiverUseCase(inMemoryReceiverRepository)
	})

	it('should be able to recover a receiver', async () => {
		const newPerson = makeReceiver({}, new UniqueEntityId('person-01'))

		newPerson.deleteReceiver()

		await inMemoryReceiverRepository.create(newPerson)

		expect(inMemoryReceiverRepository.items.at(0)).toMatchObject({
			deletedAt: expect.any(Date),
		})

		await sut.execute({
			personId: 'person-01',
		})

		expect(inMemoryReceiverRepository.items.at(0)).toMatchObject({
			deletedAt: null,
		})
	})
})
