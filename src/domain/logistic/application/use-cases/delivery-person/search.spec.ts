/* eslint-disable prettier/prettier */
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'
import { SearchDeliveryPeopleUseCase } from './search'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let sut: SearchDeliveryPeopleUseCase

describe('search for delivery people', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		sut = new SearchDeliveryPeopleUseCase(inMemoryDeliveryPersonRepository)
	})

	it('should be able to search for active delivery people', async () => {
		const newPersonOne = makeDeliveryPerson({ name: 'John Doe', city: 'Blumenau', state: 'SC' }, new UniqueEntityId('person-01'))
		const newPersonTwo = makeDeliveryPerson({ name: 'Janet Doe', city: 'Timbó', state: 'SC' }, new UniqueEntityId('person-02'))
		const newPersonThree = makeDeliveryPerson({ name: 'Janet Doe', city: 'Timbó', state: 'SC' }, new UniqueEntityId('person-03'))

		newPersonTwo.deletePerson()

		inMemoryDeliveryPersonRepository.items.push(newPersonOne)
		inMemoryDeliveryPersonRepository.items.push(newPersonTwo)
		inMemoryDeliveryPersonRepository.items.push(newPersonThree)

		const result = await sut.execute({
			query: 'Doe',
			limit: 10,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			deliveryPeople: [
				expect.objectContaining({
					id: new UniqueEntityId('person-01')
				}),
				expect.objectContaining({
					id: new UniqueEntityId('person-03')
				}),
			],
		})
	})

	it('should not be able to search for delivery people without a query with at least 2 characters', async () => {
		const response = await sut.execute({
			query: 'a',
			limit: 10,
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(InvalidQueryLengthError)
	})

	it('should be able to search for active delivery people with limit of 1 result', async () => {
		const newPersonOne = makeDeliveryPerson({ name: 'John Doe', city: 'Blumenau', state: 'SC' }, new UniqueEntityId('person-01'))
		const newPersonTwo = makeDeliveryPerson({ name: 'Janet Doe', city: 'Timbó', state: 'SC' }, new UniqueEntityId('person-02'))
		const newPersonThree = makeDeliveryPerson({ name: 'Janet Doe', city: 'Timbó', state: 'SC' }, new UniqueEntityId('person-03'))

		newPersonTwo.deletePerson()

		inMemoryDeliveryPersonRepository.items.push(newPersonOne)
		inMemoryDeliveryPersonRepository.items.push(newPersonTwo)
		inMemoryDeliveryPersonRepository.items.push(newPersonThree)

		const result = await sut.execute({
			query: 'Doe',
			limit: 1,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			deliveryPeople: [
				expect.objectContaining({
					id: new UniqueEntityId('person-01')
				}),
			],
		})
	})

})
