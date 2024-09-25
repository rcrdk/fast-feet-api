import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { RecoverDistributionCenterUseCase } from './recover'

let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let sut: RecoverDistributionCenterUseCase

describe('distribution center distribution center', () => {
	beforeEach(() => {
		inMemoryDistributionCenterRepository =
			new InMemoryDistributionCenterRepository()
		sut = new RecoverDistributionCenterUseCase(
			inMemoryDistributionCenterRepository,
		)
	})

	it('should be able to distribution center a distribution center', async () => {
		const newDistributionCenter = makeDistributionCenter(
			{},
			new UniqueEntityId('dc-01'),
		)

		newDistributionCenter.deleteDistributionCenter()

		await inMemoryDistributionCenterRepository.create(newDistributionCenter)

		expect(inMemoryDistributionCenterRepository.items.at(0)).toMatchObject({
			deletedAt: expect.any(Date),
		})

		await sut.execute({
			distributionCenterId: 'dc-01',
		})

		expect(inMemoryDistributionCenterRepository.items.at(0)).toMatchObject({
			deletedAt: null,
		})
	})
})
