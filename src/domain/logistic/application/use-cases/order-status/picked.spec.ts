import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { SetOrderStatusPickedUseCase } from './picked'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryReceiverRepository: InMemoryReceiverRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: SetOrderStatusPickedUseCase

describe('set status picked to a order', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		inMemoryAdministratorRepository = new InMemoryAdministratorRepository()
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		inMemoryOrderStatusRepository = new InMemoryOrderStatusRepository()
		inMemoryDistributionCenterRepository =
			new InMemoryDistributionCenterRepository()
		inMemoryOrderRepository = new InMemoryOrderRepository(
			inMemoryOrderStatusRepository,
			inMemoryDistributionCenterRepository,
			inMemoryAdministratorRepository,
			inMemoryReceiverRepository,
		)
		sut = new SetOrderStatusPickedUseCase(
			inMemoryOrderRepository,
			inMemoryDeliveryPersonRepository,
		)
	})

	it('it should be able to set status as picked to a order', async () => {
		const newDeliveryPerson = makeDeliveryPerson(
			{},
			new UniqueEntityId('dp-01'),
		)
		inMemoryDeliveryPersonRepository.create(newDeliveryPerson)

		const newOrder = makeOrder(
			{
				creatorId: new UniqueEntityId('admin-01'),
				deliveryPersonId: new UniqueEntityId('dp-01'),
			},
			new UniqueEntityId('order-01'),
		)
		inMemoryOrderRepository.create(newOrder)

		const result = await sut.execute({
			deliveryPersonId: 'dp-01',
			orderId: 'order-01',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryOrderRepository.items.at(0)).toMatchObject({
			creatorId: new UniqueEntityId('admin-01'),
			currentStatusCode: 'PICKED',
			deliveryPersonId: new UniqueEntityId('dp-01'),
		})

		expect(inMemoryOrderStatusRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					statusCode: 'POSTED',
					creatorId: new UniqueEntityId('admin-01'),
				}),
				expect.objectContaining({
					statusCode: 'PICKED',
					creatorId: new UniqueEntityId('dp-01'),
				}),
			]),
		)
	})

	it('it should not be able to set status as picked to another persons order', async () => {
		const newDeliveryPersonOne = makeDeliveryPerson(
			{},
			new UniqueEntityId('dp-01'),
		)
		inMemoryDeliveryPersonRepository.create(newDeliveryPersonOne)

		const newDeliveryPersonTwo = makeDeliveryPerson(
			{},
			new UniqueEntityId('dp-02'),
		)
		inMemoryDeliveryPersonRepository.create(newDeliveryPersonTwo)

		const newOrder = makeOrder(
			{
				creatorId: new UniqueEntityId('admin-01'),
				deliveryPersonId: new UniqueEntityId('dp-01'),
			},
			new UniqueEntityId('order-01'),
		)
		inMemoryOrderRepository.create(newOrder)

		const result = await sut.execute({
			deliveryPersonId: 'dp-02',
			orderId: 'order-01',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
