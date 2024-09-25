import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditReceiverUseCase } from './edit'

let inMemoryReceiverRepository: InMemoryReceiverRepository
let sut: EditReceiverUseCase

describe('edit receiver', () => {
	beforeEach(() => {
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		sut = new EditReceiverUseCase(inMemoryReceiverRepository)
	})

	it('should be able to edit a receiver', async () => {
		const newPerson = makeReceiver({}, new UniqueEntityId('person-01'))

		await inMemoryReceiverRepository.create(newPerson)

		await sut.execute({
			personId: 'person-01',
			name: 'John Doe',
			documentNumber: '666.666.666-66',
			email: 'johndoe@gmail.com',
			phone: '(77) 77777-7777',
			address: 'Rua das Dores Profundas',
			city: 'Benedito Novo',
			state: 'SC',
			zipCode: '00000-000',
			neighborhood: 'Centro',
			reference: 'Ao lado do hospital',
		})

		expect(inMemoryReceiverRepository.items.at(0)).toMatchObject({
			name: 'John Doe',
			documentNumber: '666.666.666-66',
			email: 'johndoe@gmail.com',
			phone: '(77) 77777-7777',
			address: 'Rua das Dores Profundas',
			city: 'Benedito Novo',
			state: 'SC',
			zipCode: '00000-000',
			neighborhood: 'Centro',
			reference: 'Ao lado do hospital',
		})
	})
})
