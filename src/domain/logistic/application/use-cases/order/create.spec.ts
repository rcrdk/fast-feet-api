import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'
import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments.repository'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { CreateOrderUseCase } from './create'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryReceiverRepository: InMemoryReceiverRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: CreateOrderUseCase

describe('create a order', () => {
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
		sut = new CreateOrderUseCase(inMemoryOrderRepository)
	})

	it('should be able to create a order', async () => {
		const result = await sut.execute({
			creatorId: 'admin-01',
			receiverId: 'receiver-01',
			deliveryPersonId: undefined,
			originDistributionCenterId: 'distribution-center-01',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			order: inMemoryOrderRepository.items.at(0),
		})

		expect(inMemoryOrderStatusRepository.items).toHaveLength(1)
		expect(inMemoryOrderStatusRepository.items.at(0)).toMatchObject({
			statusCode: 'POSTED',
			creatorId: new UniqueEntityId('admin-01'),
			orderId: result.value?.order.id,
			currentLocationId: new UniqueEntityId('distribution-center-01'),
		})
	})
})
