/* eslint-disable prettier/prettier */
import { makeOrder } from 'test/factories/make-order'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ViewOrderUseCase } from './view'

let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ViewOrderUseCase

describe('view a order', () => {
	beforeEach(() => {
		inMemoryOrderStatusRepository = new InMemoryOrderStatusRepository()
		inMemoryDistributionCenterRepository = new InMemoryDistributionCenterRepository()
		inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderStatusRepository, inMemoryDistributionCenterRepository)
		sut = new ViewOrderUseCase(inMemoryOrderRepository)
	})

	it('should be able to view a order', async () => {
		const newOrderOne = makeOrder({}, new UniqueEntityId('order-01'))
		const newOrderTwo = makeOrder({}, new UniqueEntityId('order-02'))

		inMemoryOrderRepository.create(newOrderOne)
		inMemoryOrderRepository.create(newOrderTwo)

		const result = await sut.execute({
			orderId: 'order-02',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			order: expect.objectContaining({
				id: new UniqueEntityId('order-02'),
			}),
		})
	})
})
