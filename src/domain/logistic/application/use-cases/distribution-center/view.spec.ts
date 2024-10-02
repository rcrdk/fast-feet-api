import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ViewDistributionCenterUseCase } from './view'

let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let sut: ViewDistributionCenterUseCase

describe('view distribution center', () => {
	beforeEach(() => {
		inMemoryDistributionCenterRepository =
			new InMemoryDistributionCenterRepository()
		sut = new ViewDistributionCenterUseCase(
			inMemoryDistributionCenterRepository,
		)
	})

	it('should be able to view a distribution center', async () => {
		const newPerson = makeDistributionCenter({}, new UniqueEntityId('dc-01'))

		await inMemoryDistributionCenterRepository.create(newPerson)

		const response = await sut.execute({
			distributionCenterId: 'dc-01',
		})

		expect(response.isRight()).toBe(true)
		expect(response.value).toEqual({
			distributionCenter: expect.objectContaining({
				distributionCenterId: expect.any(UniqueEntityId),
			}),
		})
	})
})
