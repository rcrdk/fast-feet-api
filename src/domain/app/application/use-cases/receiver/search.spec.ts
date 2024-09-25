import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { Receiver } from '@/domain/app/enterprise/entities/receiver'

import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'
import { SearchReceiversUseCase } from './search'

let inMemoryReceiverRepository: InMemoryReceiverRepository
let sut: SearchReceiversUseCase

describe('search receivers', () => {
	beforeEach(() => {
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		sut = new SearchReceiversUseCase(inMemoryReceiverRepository)
	})

	it('should be able to search for receivers by query', async () => {
		const newPersonOne = makeReceiver({
			name: 'Fátima da Cruz',
			documentNumber: '999.999.999-99',
		})

		const newPersonTwo = makeReceiver({
			name: 'John Doe',
			documentNumber: '000.999.000-00',
		})

		await inMemoryReceiverRepository.create(newPersonOne)
		await inMemoryReceiverRepository.create(newPersonTwo)

		const responseOne = await sut.execute({
			query: 'fatima',
			limit: 20,
		})

		expect(responseOne.isRight()).toBe(true)
		expect(responseOne.value).toMatchObject({
			receivers: [expect.any(Receiver)],
		})

		const responseTwo = await sut.execute({
			query: '999.0',
			limit: 20,
		})

		expect(responseTwo.isRight()).toBe(true)
		expect(responseTwo.value).toMatchObject({
			receivers: [expect.any(Receiver)],
		})
	})

	it('should not be able to search for receivers without a query with at least 2 characters', async () => {
		const response = await sut.execute({
			query: 'a',
			limit: 20,
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(InvalidQueryLengthError)
	})

	it('should be able to search for receivers by query', async () => {
		const newPersonOne = makeReceiver({
			name: 'Fátima da Cruz',
			documentNumber: '999.999.999-99',
		})

		const newPersonTwo = makeReceiver({
			name: 'John Doe',
			documentNumber: '000.999.000-00',
		})

		await inMemoryReceiverRepository.create(newPersonOne)
		await inMemoryReceiverRepository.create(newPersonTwo)

		const responseOne = await sut.execute({
			query: 'fatima',
			limit: 20,
		})

		expect(responseOne.isRight()).toBe(true)
		expect(responseOne.value).toMatchObject({
			receivers: [expect.any(Receiver)],
		})

		const responseTwo = await sut.execute({
			query: '999.0',
			limit: 20,
		})

		expect(responseTwo.isRight()).toBe(true)
		expect(responseTwo.value).toMatchObject({
			receivers: [expect.any(Receiver)],
		})
	})

	it('should be able to search for receivers by query with limit of results', async () => {
		for (let i = 1; i <= 20; i++) {
			await inMemoryReceiverRepository.create(
				makeReceiver({
					name: 'Fátima da Cruz',
					documentNumber: '999.999.999-99',
				}),
			)
		}

		const response = await sut.execute({
			query: 'fatima',
			limit: 10,
		})

		expect(response.isRight()).toBe(true)
		// @ts-expect-error receivers does exists
		expect(response.value.receivers).toHaveLength(10)
	})
})
