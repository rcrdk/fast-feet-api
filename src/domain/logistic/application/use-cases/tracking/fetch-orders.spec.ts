import { makeOrder } from 'test/factories/make-order'
import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { FetchReceiverOrdersUseCase } from './fetch-orders'

let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryReceiverRepository: InMemoryReceiverRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchReceiverOrdersUseCase

describe('fetch receiver orders', () => {
	beforeEach(() => {
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
		sut = new FetchReceiverOrdersUseCase(
			inMemoryReceiverRepository,
			inMemoryOrderRepository,
		)
	})

	it('should be able to a receiver fetch their own orders', async () => {
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
			receiverId: 'person-02',
			page: 1,
			perPage: 10,
		})

		expect(response.isRight()).toBe(true)
		expect(response.value).toMatchObject({
			data: [expect.any(Order), expect.any(Order)],
			totalItems: 2,
		})
	})

	it('should not be able to a receiver fetch another receiver orders', async () => {
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
			page: 1,
			perPage: 10,
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(UnauthorizedError)
	})

	it('should be able to a administrator fetch any receiver orders', async () => {
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

		const responseOne = await sut.execute({
			authPersonRole: 'ADMINISTRATOR',
			authReceiverId: undefined,
			receiverId: 'person-01',
			page: 1,
			perPage: 10,
		})

		expect(responseOne.isRight()).toBe(true)
		expect(responseOne.value).toMatchObject({
			data: [expect.any(Order)],
			totalItems: 1,
		})

		const responseTwo = await sut.execute({
			authPersonRole: 'ADMINISTRATOR',
			authReceiverId: undefined,
			receiverId: 'person-02',
			page: 1,
			perPage: 10,
		})

		expect(responseTwo.isRight()).toBe(true)
		expect(responseTwo.value).toMatchObject({
			data: [expect.any(Order), expect.any(Order)],
			totalItems: 2,
		})
	})

	it('should be able to a receiver fetch their own orders paginated', async () => {
		const receiver = makeReceiver({}, new UniqueEntityId('person-01'))

		await inMemoryReceiverRepository.create(receiver)

		for (let i = 1; i <= 12; i++) {
			await inMemoryOrderRepository.create(
				makeOrder({
					receiverId: receiver.id,
				}),
			)
		}

		const response = await sut.execute({
			authPersonRole: undefined,
			authReceiverId: 'person-01',
			receiverId: 'person-01',
			page: 2,
			perPage: 10,
		})

		expect(response.isRight()).toBe(true)
		expect(response.value).toMatchObject({
			data: [expect.any(Order), expect.any(Order)],
			totalItems: 12,
			totalPages: 2,
		})
	})

	it('should not be able to a deleted receiver fetch their own orders', async () => {
		const receiver = makeReceiver({}, new UniqueEntityId('person-01'))
		receiver.deleteReceiver()
		await inMemoryReceiverRepository.create(receiver)

		const order = makeOrder({ receiverId: receiver.id })
		await inMemoryOrderRepository.create(order)

		const response = await sut.execute({
			authPersonRole: undefined,
			authReceiverId: 'person-01',
			receiverId: 'person-01',
			page: 1,
			perPage: 10,
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
