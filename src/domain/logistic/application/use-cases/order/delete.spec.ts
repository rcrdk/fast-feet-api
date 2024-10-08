import { makeOrder } from 'test/factories/make-order'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'
import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments.repository'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteOrderUseCase } from './delete'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryReceiverRepository: InMemoryReceiverRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: DeleteOrderUseCase

describe('delete a order', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		inMemoryAttachmentsRepository = new InMemoryAttachementsRepository()
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
			inMemoryDeliveryPersonRepository,
			inMemoryAttachmentsRepository,
		)
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
