import { makeAdministrator } from 'test/factories/make-administrator'
import { makeDeliveryPerson } from 'test/factories/make-delivery-person'
import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { makeOrder } from 'test/factories/make-order'
import { makeReceiver } from 'test/factories/make-receiver'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'
import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments.repository'
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { ViewOrderUseCase } from './view'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryReceiverRepository: InMemoryReceiverRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ViewOrderUseCase

describe('view a order', () => {
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
		sut = new ViewOrderUseCase(inMemoryOrderRepository)
	})

	it('should be able to a delivery person view a order', async () => {
		const administrator = makeAdministrator()
		inMemoryAdministratorRepository.create(administrator)

		const deliveryPerson = makeDeliveryPerson()
		inMemoryDeliveryPersonRepository.create(deliveryPerson)

		const receiver = makeReceiver()
		inMemoryReceiverRepository.create(receiver)

		const location = makeDistributionCenter()
		inMemoryDistributionCenterRepository.create(location)

		const order = makeOrder({
			creatorId: administrator.id,
			deliveryPersonId: deliveryPerson.id,
			receiverId: receiver.id,
			originLocationId: location.id,
			currentStatusCode: 'TRANSFER_PROGRESS',
		})
		inMemoryOrderRepository.create(order)

		const result = await sut.execute({
			authPersonId: deliveryPerson.id.toString(),
			authPersonRole: deliveryPerson.role,
			orderId: order.id.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			order: expect.objectContaining({
				orderId: order.id,
			}),
		})
	})

	it('should be able to a administrator view any order', async () => {
		const administrator = makeAdministrator()
		inMemoryAdministratorRepository.create(administrator)

		const deliveryPerson = makeDeliveryPerson()
		inMemoryDeliveryPersonRepository.create(deliveryPerson)

		const receiver = makeReceiver()
		inMemoryReceiverRepository.create(receiver)

		const location = makeDistributionCenter()
		inMemoryDistributionCenterRepository.create(location)

		const order = makeOrder({
			creatorId: administrator.id,
			deliveryPersonId: deliveryPerson.id,
			receiverId: receiver.id,
			originLocationId: location.id,
			currentStatusCode: 'TRANSFER_PROGRESS',
		})
		inMemoryOrderRepository.create(order)

		const result = await sut.execute({
			authPersonId: 'admin-01',
			authPersonRole: 'ADMINISTRATOR',
			orderId: order.id.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			order: expect.objectContaining({
				orderId: order.id,
			}),
		})
	})

	it('should not be able to a delivery person view a order of another person', async () => {
		const administrator = makeAdministrator()
		inMemoryAdministratorRepository.create(administrator)

		const deliveryPerson = makeDeliveryPerson()
		inMemoryDeliveryPersonRepository.create(deliveryPerson)

		const receiver = makeReceiver()
		inMemoryReceiverRepository.create(receiver)

		const location = makeDistributionCenter()
		inMemoryDistributionCenterRepository.create(location)

		const order = makeOrder({
			creatorId: administrator.id,
			deliveryPersonId: deliveryPerson.id,
			receiverId: receiver.id,
			originLocationId: location.id,
			currentStatusCode: 'TRANSFER_PROGRESS',
		})
		inMemoryOrderRepository.create(order)

		const result = await sut.execute({
			authPersonId: 'dp-02',
			authPersonRole: 'DELIVERY_PERSON',
			orderId: order.id.toString(),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})

	it('should be able to a delivery person view a order that is available to pickup', async () => {
		const administrator = makeAdministrator()
		inMemoryAdministratorRepository.create(administrator)

		const deliveryPerson = makeDeliveryPerson()
		inMemoryDeliveryPersonRepository.create(deliveryPerson)

		const receiver = makeReceiver()
		inMemoryReceiverRepository.create(receiver)

		const location = makeDistributionCenter()
		inMemoryDistributionCenterRepository.create(location)

		const orderOne = makeOrder({
			deliveryPersonId: undefined,
			creatorId: administrator.id,
			receiverId: receiver.id,
			originLocationId: location.id,
			currentStatusCode: 'POSTED',
		})

		const orderTwo = makeOrder({
			deliveryPersonId: undefined,
			creatorId: administrator.id,
			receiverId: receiver.id,
			originLocationId: location.id,
			currentStatusCode: 'AWAITING_PICK_UP',
		})

		inMemoryOrderRepository.create(orderOne)
		inMemoryOrderRepository.create(orderTwo)

		const resultOne = await sut.execute({
			authPersonId: 'dp-01',
			authPersonRole: 'DELIVERY_PERSON',
			orderId: orderOne.id.toString(),
		})

		expect(resultOne.isRight()).toBe(true)
		expect(resultOne.value).toEqual({
			order: expect.objectContaining({
				orderId: orderOne.id,
			}),
		})

		const resultTwo = await sut.execute({
			authPersonId: 'dp-01',
			authPersonRole: 'DELIVERY_PERSON',
			orderId: orderTwo.id.toString(),
		})

		expect(resultTwo.isRight()).toBe(true)
		expect(resultTwo.value).toEqual({
			order: expect.objectContaining({
				orderId: orderTwo.id,
			}),
		})
	})
})
