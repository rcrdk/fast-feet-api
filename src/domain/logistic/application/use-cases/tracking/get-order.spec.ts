import { makeOrder } from 'test/factories/make-order'
import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'
import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments.repository'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { GetReceiverOrderUseCase } from './get-order'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryReceiverRepository: InMemoryReceiverRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: GetReceiverOrderUseCase

describe('get a receiver order', () => {
	beforeEach(() => {
		inMemoryDeliveryPersonRepository = new InMemoryDeliveryPersonRepository()
		inMemoryAttachmentsRepository = new InMemoryAttachementsRepository()
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
			inMemoryDeliveryPersonRepository,
			inMemoryAttachmentsRepository,
		)
		sut = new GetReceiverOrderUseCase(
			inMemoryReceiverRepository,
			inMemoryOrderRepository,
		)
	})

	it('should be able to a receiver get one on their orders', async () => {
		const receiver = makeReceiver({}, new UniqueEntityId('person-01'))
		await inMemoryReceiverRepository.create(receiver)

		const order = makeOrder(
			{ receiverId: receiver.id },
			new UniqueEntityId('order-02'),
		)
		await inMemoryOrderRepository.create(order)

		const response = await sut.execute({
			authPersonRole: undefined,
			authReceiverId: 'person-01',
			receiverId: 'person-01',
			orderId: 'order-02',
		})

		expect(response.isRight()).toBe(true)
		expect(response.value).toEqual({
			order: expect.objectContaining({
				id: new UniqueEntityId('order-02'),
				receiverId: new UniqueEntityId('person-01'),
			}),
		})
	})

	it('should not be able to a receiver get another receiver order', async () => {
		const receiverOne = makeReceiver({}, new UniqueEntityId('person-01'))
		const receiverTwo = makeReceiver({}, new UniqueEntityId('person-02'))

		await inMemoryReceiverRepository.create(receiverOne)
		await inMemoryReceiverRepository.create(receiverTwo)

		const orderOne = makeOrder({ receiverId: receiverOne.id })
		const orderTwo = makeOrder({ receiverId: receiverTwo.id })
		const orderThree = makeOrder({ receiverId: receiverTwo.id })

		await inMemoryOrderRepository.create(orderOne)
		await inMemoryOrderRepository.create(orderTwo)
		await inMemoryOrderRepository.create(orderThree)

		const response = await sut.execute({
			authPersonRole: undefined,
			authReceiverId: 'person-02',
			receiverId: 'person-01',
			orderId: 'order-01',
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(UnauthorizedError)
	})

	it('should be able to a administrator get any receivers order', async () => {
		const receiverOne = makeReceiver({}, new UniqueEntityId('person-01'))
		const receiverTwo = makeReceiver({}, new UniqueEntityId('person-02'))

		await inMemoryReceiverRepository.create(receiverOne)
		await inMemoryReceiverRepository.create(receiverTwo)

		const orderOne = makeOrder(
			{ receiverId: receiverOne.id },
			new UniqueEntityId('order-01'),
		)
		const orderTwo = makeOrder(
			{ receiverId: receiverTwo.id },
			new UniqueEntityId('order-02'),
		)

		await inMemoryOrderRepository.create(orderOne)
		await inMemoryOrderRepository.create(orderTwo)

		const responseOne = await sut.execute({
			authPersonRole: 'ADMINISTRATOR',
			authReceiverId: undefined,
			receiverId: 'person-01',
			orderId: 'order-01',
		})

		expect(responseOne.isRight()).toBe(true)
		expect(responseOne.value).toEqual({
			order: expect.objectContaining({
				id: new UniqueEntityId('order-01'),
				receiverId: new UniqueEntityId('person-01'),
			}),
		})

		const responseTwo = await sut.execute({
			authPersonRole: 'ADMINISTRATOR',
			authReceiverId: undefined,
			receiverId: 'person-02',
			orderId: 'order-02',
		})

		expect(responseTwo.isRight()).toBe(true)
		expect(responseTwo.value).toEqual({
			order: expect.objectContaining({
				id: new UniqueEntityId('order-02'),
				receiverId: new UniqueEntityId('person-02'),
			}),
		})
	})

	it('should not be able to a deleted receiver get one on their orders', async () => {
		const receiver = makeReceiver({}, new UniqueEntityId('person-01'))
		receiver.deleteReceiver()
		await inMemoryReceiverRepository.create(receiver)

		const order = makeOrder(
			{ receiverId: receiver.id },
			new UniqueEntityId('order-02'),
		)
		await inMemoryOrderRepository.create(order)

		const response = await sut.execute({
			authPersonRole: undefined,
			authReceiverId: 'person-01',
			receiverId: 'person-01',
			orderId: 'order-02',
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
