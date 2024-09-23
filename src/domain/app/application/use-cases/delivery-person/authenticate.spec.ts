import { FakeEncrypter } from 'test/cryptography/fake-encryper'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'

import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AuthenticateDeliveryPersonUseCase } from './authenticate'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateDeliveryPersonUseCase

describe('authenticate delivery person', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		fakeHasher = new FakeHasher()
		fakeEncrypter = new FakeEncrypter()
		sut = new AuthenticateDeliveryPersonUseCase(
			inMemoryDeliveryPersonRepository,
			fakeHasher,
			fakeEncrypter,
		)
	})

	it('should be able to authenticate a delivery person', async () => {
		const person = makeDeliveryPerson({
			documentNumber: '000.000.000-00',
			password: await fakeHasher.hash('12345678'),
		})

		inMemoryDeliveryPersonRepository.items.push(person)

		const result = await sut.execute({
			documentNumber: '000.000.000-00',
			password: '12345678',
		})

		expect(result.isRight()).toBe(true)

		const tokenPayload = result.isRight() ? result.value.accessToken : '{}'

		expect(JSON.parse(tokenPayload)).toEqual(
			expect.objectContaining({
				sub: expect.any(String),
				role: 'DELIVERY_PERSON',
			}),
		)
	})

	it('should not be able to authenticate a delivery person with invalid credentials', async () => {
		const person = makeDeliveryPerson({
			documentNumber: '000.000.000-00',
			password: await fakeHasher.hash('12345678'),
		})

		inMemoryDeliveryPersonRepository.items.push(person)

		const wrongDocumentNumber = await sut.execute({
			documentNumber: '999.999.999-99',
			password: '12345678',
		})

		expect(wrongDocumentNumber.isLeft()).toBe(true)
		expect(wrongDocumentNumber.value).toBeInstanceOf(InvalidCredentialsError)

		const wrongPasswrod = await sut.execute({
			documentNumber: '000.000.000-00',
			password: '87654321',
		})

		expect(wrongPasswrod.isLeft()).toBe(true)
		expect(wrongPasswrod.value).toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate a administrator', async () => {
		const person = makeDeliveryPerson({
			documentNumber: '000.000.000-00',
			password: await fakeHasher.hash('12345678'),
			role: 'ADMINISTRATOR',
		})

		inMemoryDeliveryPersonRepository.items.push(person)

		const result = await sut.execute({
			documentNumber: '000.000.000-00',
			password: '12345678',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})

	it('should not be able to authenticate with a deleted account', async () => {
		const person = makeDeliveryPerson({
			documentNumber: '000.000.000-00',
			password: await fakeHasher.hash('12345678'),
			deletedAt: new Date(),
		})

		inMemoryDeliveryPersonRepository.items.push(person)

		const result = await sut.execute({
			documentNumber: '000.000.000-00',
			password: '12345678',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
