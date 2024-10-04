import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ChangeDeliveryPersonPasswordUseCase } from './change-password'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let fakeHasher: FakeHasher
let sut: ChangeDeliveryPersonPasswordUseCase

describe('change delivery person password', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		fakeHasher = new FakeHasher()
		sut = new ChangeDeliveryPersonPasswordUseCase(
			inMemoryDeliveryPersonRepository,
			fakeHasher,
		)
	})

	it('should be able to change a delivery person password  with hashing', async () => {
		const newPerson = makeDeliveryPerson(
			{ password: await fakeHasher.hash('123456') },
			new UniqueEntityId('person-01'),
		)

		await inMemoryDeliveryPersonRepository.create(newPerson)

		await sut.execute({
			personId: 'person-01',
			password: '98765',
		})

		expect(inMemoryDeliveryPersonRepository.items.at(0)).toMatchObject({
			password: '98765-hashed',
		})
	})
})
