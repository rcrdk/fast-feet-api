/* eslint-disable prettier/prettier */
import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'
import { FetchDistributionCenterUseCase } from './fetch'

let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let sut: FetchDistributionCenterUseCase

describe('fetch distribution centers', () => {
	beforeEach(() => {
		inMemoryDistributionCenterRepository = new InMemoryDistributionCenterRepository()
		sut = new FetchDistributionCenterUseCase(inMemoryDistributionCenterRepository)
	})

	it('should be able to search active distribution centers', async () => {
		const newDistributionPersonOne = makeDistributionCenter({
			name: 'Fátima da Cruz',
			city: 'Timbó',
			state: 'SC',
		}, new UniqueEntityId('person-01'))

		const newDistributionPersonTwo = makeDistributionCenter({
			name: 'John Doe',
			city: 'São José dos Pinhais',
			state: 'PR',
		}, new UniqueEntityId('person-02'))

		const newDistributionPersonThree = makeDistributionCenter({
			name: 'Joana Doe',
			city: 'São Paulo',
			state: 'SP',
		}, new UniqueEntityId('person-03'))

		await inMemoryDistributionCenterRepository.create(newDistributionPersonOne)
		await inMemoryDistributionCenterRepository.create(newDistributionPersonTwo)
		await inMemoryDistributionCenterRepository.create(newDistributionPersonThree)

		const result = await sut.execute({
			query: 'Jo',
			page: 1,
			perPage: 10,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			data: [
				expect.objectContaining({
					distributionCenterId: new UniqueEntityId('person-02')
				}),
				expect.objectContaining({
					distributionCenterId: new UniqueEntityId('person-03')
				}),
			],
			totalItems: 2,
		})
	})

	it('should be able to fetch deleted distribution centers', async () => {
		const newDistributionPersonOne = makeDistributionCenter({
			name: 'Fátima da Cruz',
			city: 'Timbó',
			state: 'SC',
		}, new UniqueEntityId('person-01'))

		const newDistributionPersonTwo = makeDistributionCenter({
			name: 'John Doe',
			city: 'São José dos Pinhais',
			state: 'PR',
		}, new UniqueEntityId('person-02'))

		const newDistributionPersonThree = makeDistributionCenter({
			name: 'Joana Doe',
			city: 'São Paulo',
			state: 'SP',
		}, new UniqueEntityId('person-03'))

		newDistributionPersonThree.deleteDistributionCenter()

		await inMemoryDistributionCenterRepository.create(newDistributionPersonOne)
		await inMemoryDistributionCenterRepository.create(newDistributionPersonTwo)
		await inMemoryDistributionCenterRepository.create(newDistributionPersonThree)

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
					distributionCenterId: new UniqueEntityId('person-03')
				}),
			],
			totalItems: 1,
		})
	})

	it('should be able to fetch paginated distribution centers with filters', async () => {
		for (let i = 1; i <= 20; i++) {
			await inMemoryDistributionCenterRepository.create(
				makeDistributionCenter({
					name: 'John Doe',
					city: i % 2 ? 'Blumenau' : 'Curitiba',
					state: i % 2 ? 'SC' : 'PR',
				})
			)
		}

		const result = await sut.execute({
			query: 'Blumenau',
			page: 2,
			perPage: 5,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			totalPages: 2,
			totalItems: 10,
		})
	})

	it('should not be able to fetch distribution centers without a query with at least 2 characters', async () => {
		const result = await sut.execute({
			query: '',
			page: 1,
			perPage: 20,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidQueryLengthError)
	})
})
