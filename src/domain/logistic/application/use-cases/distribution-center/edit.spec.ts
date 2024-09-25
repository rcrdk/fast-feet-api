import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditDistributionCenterUseCase } from './edit'

let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let sut: EditDistributionCenterUseCase

describe('edit distribution center', () => {
	beforeEach(() => {
		inMemoryDistributionCenterRepository =
			new InMemoryDistributionCenterRepository()
		sut = new EditDistributionCenterUseCase(
			inMemoryDistributionCenterRepository,
		)
	})

	it('should be able to edit a distribution center', async () => {
		const newDistributionCenter = makeDistributionCenter(
			{},
			new UniqueEntityId('dc-01'),
		)

		await inMemoryDistributionCenterRepository.create(newDistributionCenter)

		await sut.execute({
			distributionCenterId: 'dc-01',
			name: 'John Doe',
			city: 'Benedito Novo',
			state: 'SC',
		})

		expect(inMemoryDistributionCenterRepository.items.at(0)).toMatchObject({
			name: 'John Doe',
			city: 'Benedito Novo',
			state: 'SC',
		})
	})
})
