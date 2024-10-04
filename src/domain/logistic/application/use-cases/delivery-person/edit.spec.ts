import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditDeliveryPersonUseCase } from './edit'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let fakeHasher: FakeHasher
let sut: EditDeliveryPersonUseCase

describe('edit delivery person', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		fakeHasher = new FakeHasher()
		sut = new EditDeliveryPersonUseCase(inMemoryDeliveryPersonRepository)
	})

	it('should be able to edit a delivery person', async () => {
		const newPerson = makeDeliveryPerson({}, new UniqueEntityId('person-01'))

		await inMemoryDeliveryPersonRepository.create(newPerson)

		await sut.execute({
			personId: 'person-01',
			name: 'John Doe',
			documentNumber: '666.666.666-66',
			email: 'johndoe@gmail.com',
			phone: '(77) 77777-7777',
			city: 'Benedito Novo',
			state: 'SC',
		})

		expect(inMemoryDeliveryPersonRepository.items.at(0)).toMatchObject({
			name: 'John Doe',
			documentNumber: '666.666.666-66',
			email: 'johndoe@gmail.com',
			phone: '(77) 77777-7777',
			city: 'Benedito Novo',
			state: 'SC',
		})
	})

	it('should be able to edit a delivery person without modifying current password', async () => {
		const newPerson = makeDeliveryPerson(
			{
				password: await fakeHasher.hash('123456'),
			},
			new UniqueEntityId('person-01'),
		)

		await inMemoryDeliveryPersonRepository.create(newPerson)

		await sut.execute({
			personId: 'person-01',
			name: 'John Doe',
			documentNumber: '666.666.666-66',
			email: 'johndoe@gmail.com',
			phone: '(77) 77777-7777',
			city: 'Benedito Novo',
			state: 'SC',
		})

		const hashedPassword = await fakeHasher.hash('123456')

		expect(inMemoryDeliveryPersonRepository.items.at(0)?.password).toBe(
			hashedPassword,
		)
	})
})
