import { FakeEncrypter } from 'test/cryptography/fake-encryper'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAdministrator } from 'test/factories/make-administrator'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'

import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { AuthenticateAdministratorUseCase } from './authenticate'

let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateAdministratorUseCase

describe('authenticate administrator', () => {
	beforeEach(() => {
		inMemoryAdministratorRepository = new InMemoryAdministratorRepository()
		fakeHasher = new FakeHasher()
		fakeEncrypter = new FakeEncrypter()
		sut = new AuthenticateAdministratorUseCase(
			inMemoryAdministratorRepository,
			fakeHasher,
			fakeEncrypter,
		)
	})

	it('should be able to authenticate a administrator', async () => {
		const person = makeAdministrator({
			documentNumber: '000.000.000-00',
			password: await fakeHasher.hash('12345678'),
		})

		inMemoryAdministratorRepository.items.push(person)

		const result = await sut.execute({
			documentNumber: '000.000.000-00',
			password: '12345678',
		})

		expect(result.isRight()).toBe(true)

		const tokenPayload = result.isRight() ? result.value.accessToken : '{}'

		expect(JSON.parse(tokenPayload)).toEqual(
			expect.objectContaining({
				sub: expect.any(String),
				role: 'ADMINISTRATOR',
			}),
		)
	})

	it('should not be able to authenticate a administrator with invalid credentials', async () => {
		const person = makeAdministrator({
			documentNumber: '000.000.000-00',
			password: await fakeHasher.hash('12345678'),
		})

		inMemoryAdministratorRepository.items.push(person)

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
		const person = makeAdministrator({
			documentNumber: '000.000.000-00',
			password: await fakeHasher.hash('12345678'),
			role: 'DELIVERY_PERSON',
		})

		inMemoryAdministratorRepository.items.push(person)

		const result = await sut.execute({
			documentNumber: '000.000.000-00',
			password: '12345678',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
