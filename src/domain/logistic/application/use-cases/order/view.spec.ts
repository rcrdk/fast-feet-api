import { makeOrder } from 'test/factories/make-order'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { ViewOrderUseCase } from './view'

let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryReceiverRepository: InMemoryReceiverRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ViewOrderUseCase

describe('view a order', () => {
	beforeEach(() => {
		inMemoryOrderStatusRepository = new InMemoryOrderStatusRepository()
		inMemoryAdministratorRepository = new InMemoryAdministratorRepository()
		inMemoryReceiverRepository = new InMemoryReceiverRepository()
		inMemoryDistributionCenterRepository =
			new InMemoryDistributionCenterRepository()
		inMemoryOrderRepository = new InMemoryOrderRepository(
			inMemoryOrderStatusRepository,
			inMemoryDistributionCenterRepository,
			inMemoryAdministratorRepository,
			inMemoryReceiverRepository,
		)
		sut = new ViewOrderUseCase(inMemoryOrderRepository)
	})

	it('should be able to a delivery person view a order', async () => {
		const order = makeOrder(
			{
				deliveryPersonId: new UniqueEntityId('dp-01'),
				currentStatusCode: 'TRANSFER_PROCESS',
			},
			new UniqueEntityId('order-01'),
		)
		inMemoryOrderRepository.create(order)

		const result = await sut.execute({
			authPersonId: 'dp-01',
			authPersonRole: 'DELIVERY_PERSON',
			orderId: 'order-01',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			order: expect.objectContaining({
				id: new UniqueEntityId('order-01'),
			}),
		})
	})

	it('should be able to a administrator view any order', async () => {
		const order = makeOrder(
			{
				deliveryPersonId: new UniqueEntityId('dp-01'),
				currentStatusCode: 'TRANSFER_PROCESS',
			},
			new UniqueEntityId('order-01'),
		)
		inMemoryOrderRepository.create(order)

		const result = await sut.execute({
			authPersonId: 'admin-01',
			authPersonRole: 'ADMINISTRATOR',
			orderId: 'order-01',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			order: expect.objectContaining({
				id: new UniqueEntityId('order-01'),
			}),
		})
	})

	it('should not be able to a delivery person view a order of another person', async () => {
		const order = makeOrder(
			{
				deliveryPersonId: new UniqueEntityId('dp-01'),
				currentStatusCode: 'TRANSFER_PROCESS',
			},
			new UniqueEntityId('order-01'),
		)
		inMemoryOrderRepository.create(order)

		const result = await sut.execute({
			authPersonId: 'dp-02',
			authPersonRole: 'DELIVERY_PERSON',
			orderId: 'order-01',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})

	it('should be able to a delivery person view a order that is available to pickup', async () => {
		const orderOne = makeOrder(
			{
				deliveryPersonId: undefined,
				currentStatusCode: 'POSTED',
			},
			new UniqueEntityId('order-01'),
		)

		const orderTwo = makeOrder(
			{
				deliveryPersonId: undefined,
				currentStatusCode: 'AWAITING_PICK_UP',
			},
			new UniqueEntityId('order-02'),
		)

		inMemoryOrderRepository.create(orderOne)
		inMemoryOrderRepository.create(orderTwo)

		const resultOne = await sut.execute({
			authPersonId: 'dp-01',
			authPersonRole: 'DELIVERY_PERSON',
			orderId: 'order-01',
		})

		expect(resultOne.isRight()).toBe(true)
		expect(resultOne.value).toEqual({
			order: expect.objectContaining({
				id: new UniqueEntityId('order-01'),
			}),
		})

		const resultTwo = await sut.execute({
			authPersonId: 'dp-01',
			authPersonRole: 'DELIVERY_PERSON',
			orderId: 'order-02',
		})

		expect(resultTwo.isRight()).toBe(true)
		expect(resultTwo.value).toEqual({
			order: expect.objectContaining({
				id: new UniqueEntityId('order-02'),
			}),
		})
	})
})
