import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { CreateReceiverUseCase } from './create'

let inMemoryReceiverRepository: InMemoryReceiverRepository
let sut: CreateReceiverUseCase

describe('create a receiver', () => {
	beforeEach(() => {
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		sut = new CreateReceiverUseCase(inMemoryReceiverRepository)
	})

	it('should be able to create a receiver', async () => {
		const result = await sut.execute({
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

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			receiver: inMemoryReceiverRepository.items.at(0),
		})
	})
})
