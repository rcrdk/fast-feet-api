import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteDistributionCenterUseCase } from './delete'

let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let sut: DeleteDistributionCenterUseCase

describe('delete distribution center', () => {
	beforeEach(() => {
		inMemoryDistributionCenterRepository =
			new InMemoryDistributionCenterRepository()
		sut = new DeleteDistributionCenterUseCase(
			inMemoryDistributionCenterRepository,
		)
	})

	it('should be able to delete a distribution center', async () => {
		const newPerson = makeDistributionCenter({}, new UniqueEntityId('dc-01'))

		await inMemoryDistributionCenterRepository.create(newPerson)

		await sut.execute({
			distributionCenterId: 'dc-01',
		})

		expect(inMemoryDistributionCenterRepository.items).toHaveLength(1)
		expect(inMemoryDistributionCenterRepository.items.at(0)).toMatchObject({
			deletedAt: expect.any(Date),
		})
	})
})
