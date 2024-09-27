/* eslint-disable prettier/prettier */
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ChangeDeliveryPersonUseCase } from './change-delivery-person'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ChangeDeliveryPersonUseCase

describe('change a delivery person of a order', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		inMemoryOrderStatusRepository = new InMemoryOrderStatusRepository()
		inMemoryDistributionCenterRepository = new InMemoryDistributionCenterRepository()
		inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderStatusRepository, inMemoryDistributionCenterRepository)
		sut = new ChangeDeliveryPersonUseCase(
			inMemoryOrderRepository,
			inMemoryDeliveryPersonRepository,
		)
	})

	it('it should be able to change a order delivery person to another', async () => {
		const deliveryPersonToSet = makeDeliveryPerson({}, new UniqueEntityId('dp-02'))
		inMemoryDeliveryPersonRepository.create(deliveryPersonToSet)

		const order = makeOrder({
			creatorId: new UniqueEntityId('admin-01'),
			deliveryPersonId: new UniqueEntityId('dp-01'),
		}, new UniqueEntityId('order-01'))

		inMemoryOrderRepository.create(order)

		const result = await sut.execute({
			authPersonId: 'admin-02',
			orderId: 'order-01',
			deliveryPersonId: 'dp-02'
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryOrderRepository.items.at(0)).toMatchObject({
			creatorId: new UniqueEntityId('admin-01'),
			currentStatusCode: 'PICKED',
			deliveryPersonId: new UniqueEntityId('dp-02'),
		})

		expect(inMemoryOrderStatusRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					statusCode: 'POSTED',
					creatorId: new UniqueEntityId('admin-01'),
				}),
				expect.objectContaining({
					statusCode: 'PICKED',
					creatorId: new UniqueEntityId('admin-02'),
				}),
			])
		)
	})

	it('it should be able to remove a delivery person of a order', async () => {
		const deliveryPersonToSet = makeDeliveryPerson({}, new UniqueEntityId('dp-02'))
		inMemoryDeliveryPersonRepository.create(deliveryPersonToSet)

		const order = makeOrder({
			creatorId: new UniqueEntityId('admin-01'),
			deliveryPersonId: new UniqueEntityId('dp-01'),
		}, new UniqueEntityId('order-01'))

		inMemoryOrderRepository.create(order)

		const result = await sut.execute({
			authPersonId: 'admin-02',
			orderId: 'order-01',
			deliveryPersonId: null
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryOrderRepository.items.at(0)).toMatchObject({
			creatorId: new UniqueEntityId('admin-01'),
			currentStatusCode: 'AWAITING_PICK_UP',
			deliveryPersonId: null,
		})

		expect(inMemoryOrderStatusRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					statusCode: 'POSTED',
					creatorId: new UniqueEntityId('admin-01'),
				}),
				expect.objectContaining({
					statusCode: 'AWAITING_PICK_UP',
					creatorId: new UniqueEntityId('admin-02'),
				}),
			])
		)
	})
})
