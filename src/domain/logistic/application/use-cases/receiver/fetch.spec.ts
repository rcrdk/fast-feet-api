/* eslint-disable prettier/prettier */
import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'
import { FetchReceiversUseCase } from './fetch'

let inMemoryReceiverRepository: InMemoryReceiverRepository
let sut: FetchReceiversUseCase

describe('fetch receivers', () => {
	beforeEach(() => {
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		sut = new FetchReceiversUseCase(inMemoryReceiverRepository)
	})

	it('should be able to search active receivers', async () => {
		const newReceiverOne = makeReceiver({ name: 'Fátima da Cruz' }, new UniqueEntityId('person-01'))
		const newReceiverTwo = makeReceiver({ name: 'John Doe' }, new UniqueEntityId('person-02'))
		const newReceiverThree = makeReceiver({ name: 'Joana Doe' }, new UniqueEntityId('person-03'))

		await inMemoryReceiverRepository.create(newReceiverOne)
		await inMemoryReceiverRepository.create(newReceiverTwo)
		await inMemoryReceiverRepository.create(newReceiverThree)

		const result = await sut.execute({
			query: 'Jo',
			page: 1,
			perPage: 10,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			data: [
				expect.objectContaining({
					id: new UniqueEntityId('person-02')
				}),
				expect.objectContaining({
					id: new UniqueEntityId('person-03')
				}),
			],
			totalItems: 2,
		})
	})

	it('should be able to fetch deleted receivers', async () => {
		const newReceiverOne = makeReceiver({ name: 'Fátima da Cruz' }, new UniqueEntityId('person-01'))
		const newReceiverTwo = makeReceiver({ name: 'John Doe' }, new UniqueEntityId('person-02'))
		const newReceiverThree = makeReceiver({ name: 'Joana Doe' }, new UniqueEntityId('person-03'))

		newReceiverThree.deleteReceiver()

		await inMemoryReceiverRepository.create(newReceiverOne)
		await inMemoryReceiverRepository.create(newReceiverTwo)
		await inMemoryReceiverRepository.create(newReceiverThree)

		const result = await sut.execute({
			query: 'Jo',
			deleted: true,
			page: 1,
			perPage: 10,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			data: [
				expect.objectContaining({
					id: new UniqueEntityId('person-03')
				}),
			],
			totalItems: 1,
		})
	})

	it('should be able to fetch paginated receivers with filters', async () => {
		for (let i = 1; i <= 20; i++) {
			await inMemoryReceiverRepository.create(
				makeReceiver({
					name: 'John Doe',
					documentNumber: i % 2 ? '888.999.000-00' : '555.999.666-33',
				})
			)
		}

		const result = await sut.execute({
			query: '88.99',
			page: 2,
			perPage: 5,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			totalPages: 2,
			totalItems: 10,
		})
	})

	it('should not be able to fetch receivers without a query with at least 2 characters', async () => {
		const result = await sut.execute({
			query: '',
			page: 1,
			perPage: 20,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidQueryLengthError)
	})
})
