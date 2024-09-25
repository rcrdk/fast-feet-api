import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'

import { CreateDistributionCenterUseCase } from './create'

let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let sut: CreateDistributionCenterUseCase

describe('create a distribution center', () => {
	beforeEach(() => {
		inMemoryDistributionCenterRepository =
			new InMemoryDistributionCenterRepository()
		sut = new CreateDistributionCenterUseCase(
			inMemoryDistributionCenterRepository,
		)
	})

	it('should be able to create a distribution center', async () => {
		const result = await sut.execute({
			name: 'John Doe Center',
			city: 'Benedito Novo',
			state: 'SC',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			distributionCenter: inMemoryDistributionCenterRepository.items.at(0),
		})
	})
})
