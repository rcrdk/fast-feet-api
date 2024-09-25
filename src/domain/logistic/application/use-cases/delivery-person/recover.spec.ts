import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { RecoverDeliveryPersonUseCase } from './recover'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let sut: RecoverDeliveryPersonUseCase

describe('recover delivery person', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		sut = new RecoverDeliveryPersonUseCase(inMemoryDeliveryPersonRepository)
	})

	it('should be able to recover a delivery person', async () => {
		const newPerson = makeDeliveryPerson({}, new UniqueEntityId('person-01'))

		newPerson.deletePerson()

		await inMemoryDeliveryPersonRepository.create(newPerson)

		expect(inMemoryDeliveryPersonRepository.items.at(0)).toMatchObject({
			deletedAt: expect.any(Date),
		})

		await sut.execute({
			personId: 'person-01',
		})

		expect(inMemoryDeliveryPersonRepository.items.at(0)).toMatchObject({
			deletedAt: null,
		})
	})
})
