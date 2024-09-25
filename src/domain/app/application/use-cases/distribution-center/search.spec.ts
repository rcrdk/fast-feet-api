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

	it('should be able to search for distribution center by query', async () => {
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
		})

		expect(responseOne.isRight()).toBe(true)
		expect(responseOne.value).toMatchObject({
			distributionCenters: [expect.any(DistributionCenter)],
		})

		const responseTwo = await sut.execute({
			query: 'sao',
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
		})

		expect(responseThree.isRight()).toBe(true)
		expect(responseThree.value).toMatchObject({
			distributionCenters: [expect.any(DistributionCenter)],
		})
	})

	it('should not be able to search for distribution center without a query with at least 2 characters', async () => {
		const response = await sut.execute({
			query: 'a',
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(InvalidQueryLengthError)
	})
})
