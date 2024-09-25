import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'

import { DistributionCenter } from '@/domain/app/enterprise/entities/distribution-center'

import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'
import { SearchDistributionCentersUseCase } from './search'

let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let sut: SearchDistributionCentersUseCase

describe('search distribution center', () => {
	beforeEach(() => {
		inMemoryDistributionCenterRepository =
			new InMemoryDistributionCenterRepository()
		sut = new SearchDistributionCentersUseCase(
			inMemoryDistributionCenterRepository,
		)
	})

	it('should be able to search for distribution centers by query', async () => {
		const newDistributionPersonOne = makeDistributionCenter({
			name: 'Fátima da Cruz',
			city: 'Timbó',
			state: 'SC',
		})

		const newDistributionPersonTwo = makeDistributionCenter({
			name: 'John Doe',
			city: 'São José dos Pinhais',
			state: 'PR',
		})

		const newDistributionPersonThree = makeDistributionCenter({
			name: 'Joana Doe',
			city: 'São Paulo',
			state: 'SP',
		})

		await inMemoryDistributionCenterRepository.create(newDistributionPersonOne)
		await inMemoryDistributionCenterRepository.create(newDistributionPersonTwo)
		// eslint-disable-next-line prettier/prettier
		await inMemoryDistributionCenterRepository.create(newDistributionPersonThree)

		const responseOne = await sut.execute({
			query: 'fatima',
			limit: 20,
		})

		expect(responseOne.isRight()).toBe(true)
		expect(responseOne.value).toMatchObject({
			distributionCenters: [expect.any(DistributionCenter)],
		})

		const responseTwo = await sut.execute({
			query: 'sao',
			limit: 20,
		})

		expect(responseTwo.isRight()).toBe(true)
		expect(responseTwo.value).toMatchObject({
			distributionCenters: [
				expect.any(DistributionCenter),
				expect.any(DistributionCenter),
			],
		})

		const responseThree = await sut.execute({
			query: 'PR',
			limit: 20,
		})

		expect(responseThree.isRight()).toBe(true)
		expect(responseThree.value).toMatchObject({
			distributionCenters: [expect.any(DistributionCenter)],
		})
	})

	it('should not be able to search for distribution centers without a query with at least 2 characters', async () => {
		const response = await sut.execute({
			query: 'a',
			limit: 20,
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(InvalidQueryLengthError)
	})

	it('should be able to search for distribution centers by query with limit of results', async () => {
		for (let i = 1; i <= 20; i++) {
			await inMemoryDistributionCenterRepository.create(
				makeDistributionCenter({
					name: 'Fátima da Cruz',
					city: 'Timbó',
					state: 'SC',
				}),
			)
		}

		const response = await sut.execute({
			query: 'fatima',
			limit: 10,
		})

		expect(response.isRight()).toBe(true)
		// @ts-expect-error distributionCenters does exists
		expect(response.value.distributionCenters).toHaveLength(10)
	})
})
