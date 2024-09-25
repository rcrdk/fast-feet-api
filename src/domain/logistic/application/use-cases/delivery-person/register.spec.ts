import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'

import { RegisterDeliveryPersonUseCase } from './register'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let fakeHasher: FakeHasher
let sut: RegisterDeliveryPersonUseCase

describe('register a delivery person', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		fakeHasher = new FakeHasher()
		sut = new RegisterDeliveryPersonUseCase(
			inMemoryDeliveryPersonRepository,
			fakeHasher,
		)
	})

	it('should be able to register a delivery person', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			documentNumber: '000.000.000-00',
			password: '123456',
			email: 'johndoe@example.com',
			phone: '(00) 00000-0000',
			city: 'Blumenau',
			state: 'SC',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			deliveryPerson: inMemoryDeliveryPersonRepository.items.at(0),
		})
	})

	it('should hash delivery person password during registration', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			documentNumber: '000.000.000-00',
			password: '123456',
			email: 'johndoe@example.com',
			phone: '(00) 00000-0000',
			city: 'Blumenau',
			state: 'SC',
		})

		const hashedPassword = await fakeHasher.hash('123456')

		expect(result.isRight()).toBe(true)
		expect(inMemoryDeliveryPersonRepository.items.at(0)?.password).toBe(
			hashedPassword,
		)
	})
})
