/* eslint-disable prettier/prettier */
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { MinQuerySearchNotProviedError } from '../errors/expected-one-search-param-error'
import { FetchDeliveryPeopleUseCase } from './fetch'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let sut: FetchDeliveryPeopleUseCase

describe('fetch delivery people', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		sut = new FetchDeliveryPeopleUseCase(inMemoryDeliveryPersonRepository)
	})

	it('should be able to fetch active delivery people', async () => {
		const newPersonOne = makeDeliveryPerson({ name: 'John Doe', city: 'Blumenau', state: 'SC' }, new UniqueEntityId('person-01'))
		const newPersonTwo = makeDeliveryPerson({ name: 'Janet Doe', city: 'Timbó', state: 'SC' }, new UniqueEntityId('person-02'))
		const newPersonThree = makeDeliveryPerson({ name: 'Janet Doe', city: 'Timbó', state: 'SC' }, new UniqueEntityId('person-03'))

		newPersonTwo.deletePerson()

		inMemoryDeliveryPersonRepository.items.push(newPersonOne)
		inMemoryDeliveryPersonRepository.items.push(newPersonTwo)
		inMemoryDeliveryPersonRepository.items.push(newPersonThree)

		const result = await sut.execute({
			name: '',
			city: '',
			state: 'SC',
			deleted: false,
			page: 1,
			perPage: 20,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			data: [
				expect.objectContaining({
					personId: new UniqueEntityId('person-01')
				}),
				expect.objectContaining({
					personId: new UniqueEntityId('person-03')
				}),
			],
			totalItems: 2,
		})
	})

	it('should be able to fetch deleted delivery people', async () => {
		const newPersonOne = makeDeliveryPerson({ name: 'John Doe', city: 'Blumenau', state: 'SC' }, new UniqueEntityId('person-01'))
		const newPersonTwo = makeDeliveryPerson({ name: 'Janet Doe', city: 'Timbó', state: 'SC' }, new UniqueEntityId('person-02'))
		const newPersonThree = makeDeliveryPerson({ name: 'Janet Doe', city: 'Timbó', state: 'SC' }, new UniqueEntityId('person-03'))

		newPersonOne.deletePerson()
		newPersonThree.deletePerson()

		inMemoryDeliveryPersonRepository.items.push(newPersonOne)
		inMemoryDeliveryPersonRepository.items.push(newPersonTwo)
		inMemoryDeliveryPersonRepository.items.push(newPersonThree)

		const result = await sut.execute({
			name: '',
			city: '',
			state: 'SC',
			deleted: true,
			page: 1,
			perPage: 20,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			data: [
				expect.objectContaining({
					personId: new UniqueEntityId('person-01')
				}),
				expect.objectContaining({
					personId: new UniqueEntityId('person-03')
				}),
			],
			totalItems: 2,
		})
	})

	it('should be able to fetch paginated delivery people with filters', async () => {
		for (let i = 1; i <= 20; i++) {
			await inMemoryDeliveryPersonRepository.create(
				makeDeliveryPerson({
					name: 'John Doe',
					city: i % 2 ? 'Blumenau' : 'Curitiba',
					state: i % 2 ? 'SC' : 'PR',
				})
			)
		}

		const result = await sut.execute({
			city: 'Blumenau',
			state: 'SC',
			page: 2,
			perPage: 5,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			totalPages: 2,
			totalItems: 10,
		})
	})

	it('should not be able to fetch delivery people without params', async () => {
		const result = await sut.execute({
			name: '',
			city: '',
			state: '',
			deleted: false,
			page: 1,
			perPage: 20,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(MinQuerySearchNotProviedError)
	})
})
