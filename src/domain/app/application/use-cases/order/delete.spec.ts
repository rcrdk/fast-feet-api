/* eslint-disable prettier/prettier */
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteOrderUseCase } from './delete'

let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: DeleteOrderUseCase

describe('delete a order', () => {
	beforeEach(() => {
		inMemoryOrderStatusRepository = new InMemoryOrderStatusRepository()
		inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderStatusRepository)
		sut = new DeleteOrderUseCase(inMemoryOrderRepository)
	})

	it('should be able to delete a order', async () => {
		const newOrderOne = makeOrder({}, new UniqueEntityId('order-01'))
		const newOrderTwo = makeOrder({}, new UniqueEntityId('order-02'))

		inMemoryOrderRepository.create(newOrderOne)
		inMemoryOrderRepository.create(newOrderTwo)

		expect(inMemoryOrderRepository.items).toHaveLength(2)
		expect(inMemoryOrderStatusRepository.items).toHaveLength(2)

		const result = await sut.execute({
			orderId: 'order-01',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryOrderRepository.items).toHaveLength(1)
		expect(inMemoryOrderStatusRepository.items).toHaveLength(1)
	})
})
