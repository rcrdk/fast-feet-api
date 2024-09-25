import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'

import { RegisterAdministratorUseCase } from './register'

let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let fakeHasher: FakeHasher
let sut: RegisterAdministratorUseCase

describe('register a administrator', () => {
	beforeEach(() => {
		inMemoryAdministratorRepository = new InMemoryAdministratorRepository()
		fakeHasher = new FakeHasher()
		sut = new RegisterAdministratorUseCase(
			inMemoryAdministratorRepository,
			fakeHasher,
		)
	})

	it('should be able to register a administrator', async () => {
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
			administrator: inMemoryAdministratorRepository.items.at(0),
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
		expect(inMemoryAdministratorRepository.items.at(0)?.password).toBe(
			hashedPassword,
		)
	})
})
