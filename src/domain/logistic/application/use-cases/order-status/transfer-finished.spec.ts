/* eslint-disable prettier/prettier */
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { SetOrderStatusTransferFinishedUseCase } from './transfer-finished'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: SetOrderStatusTransferFinishedUseCase

describe('set status transfer finished to a order', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		inMemoryOrderStatusRepository = new InMemoryOrderStatusRepository()
		inMemoryDistributionCenterRepository = new InMemoryDistributionCenterRepository()
		inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderStatusRepository, inMemoryDistributionCenterRepository)
		sut = new SetOrderStatusTransferFinishedUseCase(
			inMemoryOrderRepository,
			inMemoryDeliveryPersonRepository,
		)
	})

	it('it should be able to set status as transfer finished to a order', async () => {
		const newDeliveryPerson = makeDeliveryPerson({}, new UniqueEntityId('dp-01'))
		inMemoryDeliveryPersonRepository.create(newDeliveryPerson)

		const newLocation = makeDistributionCenter({}, new UniqueEntityId('location-02'))
		inMemoryDistributionCenterRepository.create(newLocation)

		const newOrder = makeOrder({
			creatorId: new UniqueEntityId('admin-01'),
			deliveryPersonId: new UniqueEntityId('dp-01'),
		}, new UniqueEntityId('order-01'))
		inMemoryOrderRepository.create(newOrder)

		const result = await sut.execute({
			deliveryPersonId: 'dp-01',
			orderId: 'order-01',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryOrderRepository.items.at(0)).toMatchObject({
			creatorId: new UniqueEntityId('admin-01'),
			currentStatusCode: 'TRANSFER_FINISHED',
			deliveryPersonId: new UniqueEntityId('dp-01'),
		})

		expect(inMemoryOrderStatusRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					statusCode: 'POSTED',
					creatorId: new UniqueEntityId('admin-01'),
				}),
				expect.objectContaining({
					statusCode: 'TRANSFER_FINISHED',
					creatorId: new UniqueEntityId('dp-01'),
				}),
			])
		)
	})

	it('it should not be able to set status as transfer finished to another persons order', async () => {
		const newDeliveryPersonOne = makeDeliveryPerson({}, new UniqueEntityId('dp-01'))
		inMemoryDeliveryPersonRepository.create(newDeliveryPersonOne)

		const newLocation = makeDistributionCenter({}, new UniqueEntityId('location-02'))
		inMemoryDistributionCenterRepository.create(newLocation)

		const newDeliveryPersonTwo = makeDeliveryPerson({}, new UniqueEntityId('dp-02'))
		inMemoryDeliveryPersonRepository.create(newDeliveryPersonTwo)

		const newOrder = makeOrder({
			creatorId: new UniqueEntityId('admin-01'),
			deliveryPersonId: new UniqueEntityId('dp-01'),
		}, new UniqueEntityId('order-01'))
		inMemoryOrderRepository.create(newOrder)

		const result = await sut.execute({
			deliveryPersonId: 'dp-02',
			orderId: 'order-01',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
