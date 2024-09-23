import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteDeliveryPersonUseCase } from './delete'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let sut: DeleteDeliveryPersonUseCase

describe('delete delivery person', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		sut = new DeleteDeliveryPersonUseCase(inMemoryDeliveryPersonRepository)
	})

	it('should be able to delete a delivery person', async () => {
		const newPerson = makeDeliveryPerson({}, new UniqueEntityId('person-01'))

		await inMemoryDeliveryPersonRepository.create(newPerson)

		await sut.execute({
			personId: 'person-01',
		})

		expect(inMemoryDeliveryPersonRepository.items).toHaveLength(1)
		expect(inMemoryDeliveryPersonRepository.items.at(0)).toMatchObject({
			deletedAt: expect.any(Date),
		})
	})
})
