/* eslint-disable prettier/prettier */
import { makeAdministrator } from 'test/factories/make-administrator'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { DeliveryPersonOrdersUseCase } from './orders'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: DeliveryPersonOrdersUseCase

describe('fetch current orders of a delivery person', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		inMemoryAdministratorRepository = new InMemoryAdministratorRepository()
		inMemoryDistributionCenterRepository = new InMemoryDistributionCenterRepository()
		inMemoryOrderStatusRepository = new InMemoryOrderStatusRepository()
		inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderStatusRepository, inMemoryDistributionCenterRepository)
		sut = new DeliveryPersonOrdersUseCase(inMemoryDeliveryPersonRepository, inMemoryOrderRepository)
	})

	it('should be able to a delivery person fetch their own current orders', async () => {
		const deliveryPersonOne = makeDeliveryPerson({}, new UniqueEntityId('person-01'))
		const deliveryPersonTwo = makeDeliveryPerson({}, new UniqueEntityId('person-02'))

		inMemoryDeliveryPersonRepository.items.push(deliveryPersonOne)
		inMemoryDeliveryPersonRepository.items.push(deliveryPersonTwo)

		const orderOne = makeOrder({ deliveryPersonId: deliveryPersonOne.id }, new UniqueEntityId('order-01'))
		const orderTwo = makeOrder({ deliveryPersonId: deliveryPersonTwo.id }, new UniqueEntityId('order-02'))

		inMemoryOrderRepository.items.push(orderOne)
		inMemoryOrderRepository.items.push(orderTwo)

		const authenticatedPerson = deliveryPersonTwo

		const result = await sut.execute({
			authPersonId: authenticatedPerson.id.toString(),
			authRole: authenticatedPerson.role,
			deliveryPersonId: deliveryPersonTwo.id.toString(),
			page: 1,
			perPage: 10,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			data: [
				expect.objectContaining({
					id: new UniqueEntityId('order-02')
				}),
			],
			totalItems: 1,
		})
	})

	it('should be able to a delivery person fetch their own current orders with pagination', async () => {
		const deliveryPersonOne = makeDeliveryPerson({}, new UniqueEntityId('person-01'))
		const deliveryPersonTwo = makeDeliveryPerson({}, new UniqueEntityId('person-02'))

		inMemoryDeliveryPersonRepository.items.push(deliveryPersonOne)
		inMemoryDeliveryPersonRepository.items.push(deliveryPersonTwo)

		for (let i = 1; i <= 30; i++) {
			await inMemoryOrderRepository.create(
				makeOrder({
					deliveryPersonId: i <= 15 ?  deliveryPersonOne.id : deliveryPersonTwo.id
				}, new UniqueEntityId(`order-${i}`))
			)
		}
		
		const authenticatedPerson = deliveryPersonOne

		const result = await sut.execute({
			authPersonId: authenticatedPerson.id.toString(),
			authRole: authenticatedPerson.role,
			deliveryPersonId: deliveryPersonOne.id.toString(),
			page: 2,
			perPage: 10,
		})

		expect(result.isRight()).toBe(true)
		// @ts-expect-error data does exists
		expect(result.value.data).toHaveLength(5)
		expect(result.value).toMatchObject({
			totalPages: 2,
			totalItems: 15,
		})
	})

	it('should not be able to a another delivery person fetch another persons current orders', async () => {
		const deliveryPersonOne = makeDeliveryPerson({}, new UniqueEntityId('person-01'))
		const deliveryPersonTwo = makeDeliveryPerson({}, new UniqueEntityId('person-02'))

		inMemoryDeliveryPersonRepository.items.push(deliveryPersonOne)
		inMemoryDeliveryPersonRepository.items.push(deliveryPersonTwo)

		const orderOne = makeOrder({ deliveryPersonId: deliveryPersonOne.id }, new UniqueEntityId('order-01'))
		const orderTwo = makeOrder({ deliveryPersonId: deliveryPersonTwo.id }, new UniqueEntityId('order-02'))

		inMemoryOrderRepository.items.push(orderOne)
		inMemoryOrderRepository.items.push(orderTwo)

		const authenticatedPerson = deliveryPersonOne

		const result = await sut.execute({
			authPersonId: authenticatedPerson.id.toString(),
			authRole: authenticatedPerson.role,
			deliveryPersonId: deliveryPersonTwo.id.toString(),
			page: 1,
			perPage: 10,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
	
	it('should be able to a administrator fetch any delivery persons current orders', async () => {
		const deliveryPersonOne = makeDeliveryPerson({}, new UniqueEntityId('person-01'))
		const deliveryPersonTwo = makeDeliveryPerson({}, new UniqueEntityId('person-02'))

		inMemoryDeliveryPersonRepository.items.push(deliveryPersonOne)
		inMemoryDeliveryPersonRepository.items.push(deliveryPersonTwo)

		const orderOne = makeOrder({ deliveryPersonId: deliveryPersonOne.id }, new UniqueEntityId('order-01'))
		const orderTwo = makeOrder({ deliveryPersonId: deliveryPersonTwo.id }, new UniqueEntityId('order-02'))

		inMemoryOrderRepository.items.push(orderOne)
		inMemoryOrderRepository.items.push(orderTwo)

		const authenticatedPerson = makeAdministrator({}, new UniqueEntityId('admin-01'))
		inMemoryAdministratorRepository.items.push(authenticatedPerson)

		const resultOne = await sut.execute({
			authPersonId: authenticatedPerson.id.toString(),
			authRole: authenticatedPerson.role,
			deliveryPersonId: deliveryPersonTwo.id.toString(),
			page: 1,
			perPage: 10,
		})

		expect(resultOne.isRight()).toBe(true)
		expect(resultOne.value).toMatchObject({
			data: [
				expect.objectContaining({
					id: new UniqueEntityId('order-02')
				}),
			],
			totalItems: 1,
		})

		const resultTwo = await sut.execute({
			authPersonId: authenticatedPerson.id.toString(),
			authRole: authenticatedPerson.role,
			deliveryPersonId: deliveryPersonOne.id.toString(),
			page: 1,
			perPage: 10,
		})

		expect(resultTwo.isRight()).toBe(true)
		expect(resultTwo.value).toMatchObject({
			data: [
				expect.objectContaining({
					id: new UniqueEntityId('order-01')
				}),
			],
			totalItems: 1,
		})
	})

	
})
