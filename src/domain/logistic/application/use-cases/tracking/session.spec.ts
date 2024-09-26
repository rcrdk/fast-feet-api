import { FakeEncrypter } from 'test/cryptography/fake-encryper'
import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { CreateReceiverSessionUseCase } from './session'

let inMemoryReceiverRepository: InMemoryReceiverRepository
let fakeEncrypter: FakeEncrypter
let sut: CreateReceiverSessionUseCase

describe('authenticate receiver', () => {
	beforeEach(() => {
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		fakeEncrypter = new FakeEncrypter()
		sut = new CreateReceiverSessionUseCase(
			inMemoryReceiverRepository,
			fakeEncrypter,
		)
	})

	it('should be able to authenticate a receiver', async () => {
		const person = makeReceiver({ documentNumber: '000.000.000-00' })
		inMemoryReceiverRepository.items.push(person)

		const result = await sut.execute({
			documentNumber: '000.000.000-00',
		})

		expect(result.isRight()).toBe(true)

		const tokenPayload = result.isRight() ? result.value.accessToken : '{}'

		expect(JSON.parse(tokenPayload)).toEqual(
			expect.objectContaining({
				sub: expect.any(String),
			}),
		)
	})

	it('should not be able to authenticate a receiver with invalid credentials', async () => {
		const person = makeReceiver({ documentNumber: '000.000.000-00' })
		inMemoryReceiverRepository.items.push(person)

		const wrongDocumentNumber = await sut.execute({
			documentNumber: '999.999.999-99',
		})

		expect(wrongDocumentNumber.isLeft()).toBe(true)
		expect(wrongDocumentNumber.value).toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate a deleted receiver', async () => {
		const person = makeReceiver({ documentNumber: '000.000.000-00' })
		person.deleteReceiver()
		inMemoryReceiverRepository.items.push(person)

		const response = await sut.execute({
			documentNumber: '000.000.000-00',
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(InvalidCredentialsError)
	})
})
