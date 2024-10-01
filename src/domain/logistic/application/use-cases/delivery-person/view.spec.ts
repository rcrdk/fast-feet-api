import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ViewDeliveryPersonUseCase } from './view'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let sut: ViewDeliveryPersonUseCase

describe('view delivery person', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		sut = new ViewDeliveryPersonUseCase(inMemoryDeliveryPersonRepository)
	})

	it('should be able to view a delivery person', async () => {
		const newPerson = makeDeliveryPerson({}, new UniqueEntityId('person-01'))

		await inMemoryDeliveryPersonRepository.create(newPerson)

		const response = await sut.execute({
			personId: 'person-01',
		})

		expect(response.isRight()).toBe(true)
		expect(response.value).toEqual({
			deliveryPerson: expect.objectContaining({
				personId: expect.any(UniqueEntityId),
			}),
		})
	})
})
