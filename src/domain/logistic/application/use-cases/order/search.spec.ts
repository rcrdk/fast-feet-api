import dayjs from 'dayjs'
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

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { InvalidDateError } from '../errors/invalid-date-error'
import { InvalidDatePeriodError } from '../errors/invalid-date-period-error'
import { SearchOrdersUseCase } from './search'

let inMemoryDeliveryPersonRepository: InMemoryDeliveryPersonRepository
let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryReceiverRepository: InMemoryReceiverRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: SearchOrdersUseCase

describe('search orders', () => {
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
		sut = new SearchOrdersUseCase(inMemoryOrderRepository)
	})

	it('should be a invalid dates on search orders "updatedAt" filter param', async () => {
		const resultStartDate = await sut.execute({
			updatedFrom: 'testeinvalid date',
			page: 1,
			perPage: 20,
		})

		expect(resultStartDate.value).toBeInstanceOf(InvalidDateError)

		const resultEndDate = await sut.execute({
			updatedUntil: 'testeinvalid date',
			page: 1,
			perPage: 20,
		})

		expect(resultEndDate.value).toBeInstanceOf(InvalidDateError)
	})

	it('should be a invalid date period on search orders "updatedAt" filter param', async () => {
		const result = await sut.execute({
			updatedFrom: new Date('2024-12-23').toString(),
			updatedUntil: new Date('2020-01-01').toString(),
			page: 1,
			perPage: 20,
		})

		expect(result.value).toBeInstanceOf(InvalidDatePeriodError)
	})

	it('should be able to search for orders last updated between dates', async () => {
		const distributionCenter = makeDistributionCenter()
		await inMemoryDistributionCenterRepository.create(distributionCenter)

		const administrator = makeAdministrator()
		inMemoryAdministratorRepository.create(administrator)

		const receiver = makeReceiver()
		inMemoryReceiverRepository.create(receiver)

		for (let i = 10; i <= 30; i++) {
			await inMemoryOrderRepository.create(
				makeOrder(
					{
						creatorId: administrator.id,
						receiverId: receiver.id,
						currentLocationId: distributionCenter.id,
						originLocationId: distributionCenter.id,
						updatedAt: new Date(`2024-01-${i} 12:00:00`),
					},
					new UniqueEntityId(`id-2024-01-${i}`),
				),
			)
		}

		const result = await sut.execute({
			updatedFrom: dayjs('2024-01-21').toString(),
			updatedUntil: dayjs('2024-01-23').toString(),
			page: 1,
			perPage: 10,
		})

		expect(result.value).toMatchObject({
			totalItems: 3,
		})

		// @ts-expect-error data does exists
		expect(result.value.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-23'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-22'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-22'),
				}),
			]),
		)
	})

	it('should be able to search for orders last updated from a date', async () => {
		const distributionCenter = makeDistributionCenter()
		await inMemoryDistributionCenterRepository.create(distributionCenter)

		const administrator = makeAdministrator()
		inMemoryAdministratorRepository.create(administrator)

		const receiver = makeReceiver()
		inMemoryReceiverRepository.create(receiver)

		for (let i = 10; i <= 30; i++) {
			await inMemoryOrderRepository.create(
				makeOrder(
					{
						creatorId: administrator.id,
						receiverId: receiver.id,
						currentLocationId: distributionCenter.id,
						originLocationId: distributionCenter.id,
						updatedAt: new Date(`2024-01-${i} 12:00:00`),
					},
					new UniqueEntityId(`id-2024-01-${i}`),
				),
			)
		}

		const result = await sut.execute({
			updatedFrom: dayjs('2024-01-26').toString(),
			updatedUntil: undefined,
			page: 1,
			perPage: 10,
		})

		expect(result.value).toMatchObject({
			totalItems: 5,
		})

		// @ts-expect-error data does exists
		expect(result.value.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-26'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-27'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-28'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-29'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-30'),
				}),
			]),
		)
	})

	it('should be able to search for orders last updated until a date', async () => {
		const distributionCenter = makeDistributionCenter()
		await inMemoryDistributionCenterRepository.create(distributionCenter)

		const administrator = makeAdministrator()
		inMemoryAdministratorRepository.create(administrator)

		const receiver = makeReceiver()
		inMemoryReceiverRepository.create(receiver)

		for (let i = 10; i <= 30; i++) {
			await inMemoryOrderRepository.create(
				makeOrder(
					{
						creatorId: administrator.id,
						receiverId: receiver.id,
						currentLocationId: distributionCenter.id,
						originLocationId: distributionCenter.id,
						updatedAt: new Date(`2024-01-${i} 12:00:00`),
					},
					new UniqueEntityId(`id-2024-01-${i}`),
				),
			)
		}

		const result = await sut.execute({
			updatedFrom: undefined,
			updatedUntil: dayjs('2024-01-14').toString(),
			page: 1,
			perPage: 10,
		})

		expect(result.value).toMatchObject({
			totalItems: 5,
		})

		// @ts-expect-error data does exists
		expect(result.value.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-14'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-13'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-12'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-11'),
				}),
				expect.objectContaining({
					orderId: new UniqueEntityId('id-2024-01-10'),
				}),
			]),
		)
	})

	it('should be able to search for orders paginated', async () => {
		const distributionCenter = makeDistributionCenter()
		await inMemoryDistributionCenterRepository.create(distributionCenter)

		const administrator = makeAdministrator()
		inMemoryAdministratorRepository.create(administrator)

		const receiver = makeReceiver()
		inMemoryReceiverRepository.create(receiver)

		for (let i = 10; i <= 30; i++) {
			await inMemoryOrderRepository.create(
				makeOrder(
					{
						creatorId: administrator.id,
						receiverId: receiver.id,
						currentLocationId: distributionCenter.id,
						originLocationId: distributionCenter.id,
						updatedAt: new Date(`2024-01-${i} 12:00:00`),
					},
					new UniqueEntityId(`id-2024-01-${i}`),
				),
			)
		}

		const result = await sut.execute({
			updatedFrom: dayjs('2024-01-15').toString(),
			updatedUntil: dayjs('2024-01-30').toString(),
			page: 1,
			perPage: 10,
		})

		expect(result.value).toMatchObject({
			totalPages: 2,
			totalItems: 16,
		})
	})

	it('should be able to search for orders with filters', async () => {
		const administrator = makeAdministrator()
		inMemoryAdministratorRepository.create(administrator)

		const deliveryPersonOne = makeDeliveryPerson()
		const deliveryPersonTwo = makeDeliveryPerson()
		const deliveryPersonThree = makeDeliveryPerson()
		await inMemoryDeliveryPersonRepository.create(deliveryPersonOne)
		await inMemoryDeliveryPersonRepository.create(deliveryPersonTwo)
		await inMemoryDeliveryPersonRepository.create(deliveryPersonThree)

		const distributionCenterOne = makeDistributionCenter()
		const distributionCenterTwo = makeDistributionCenter()
		await inMemoryDistributionCenterRepository.create(distributionCenterOne)
		await inMemoryDistributionCenterRepository.create(distributionCenterTwo)

		const receiverOne = makeReceiver()
		const receiverTwo = makeReceiver()
		inMemoryReceiverRepository.create(receiverOne)
		inMemoryReceiverRepository.create(receiverTwo)

		const orderOne = makeOrder({
			creatorId: administrator.id,
			deliveryPersonId: deliveryPersonOne.id,
			currentLocationId: distributionCenterOne.id,
			currentStatusCode: 'TRANSFER_PROCESS',
			receiverId: receiverOne.id,
		})

		const orderTwo = makeOrder({
			creatorId: administrator.id,
			deliveryPersonId: deliveryPersonTwo.id,
			currentLocationId: distributionCenterOne.id,
			receiverId: receiverTwo.id,
			currentStatusCode: 'PICKED',
		})

		const orderThree = makeOrder({
			creatorId: administrator.id,
			deliveryPersonId: deliveryPersonThree.id,
			currentLocationId: distributionCenterTwo.id,
			receiverId: receiverTwo.id,
			currentStatusCode: 'ON_ROUTE',
		})

		inMemoryOrderRepository.items.push(orderOne)
		inMemoryOrderRepository.items.push(orderTwo)
		inMemoryOrderRepository.items.push(orderThree)

		const resultDeliveryPerson = await sut.execute({
			currentDeliveryPersonId: deliveryPersonOne.id.toString(),
			currentLocationId: undefined,
			currentStatus: undefined,
			receiverId: undefined,
			page: 1,
			perPage: 10,
		})

		// @ts-expect-error data does exists
		expect(resultDeliveryPerson.value.data).toHaveLength(1)

		const resultLocationId = await sut.execute({
			currentDeliveryPersonId: undefined,
			currentLocationId: distributionCenterOne.id.toString(),
			currentStatus: undefined,
			receiverId: undefined,
			page: 1,
			perPage: 10,
		})

		// @ts-expect-error data does exists
		expect(resultLocationId.value.data).toHaveLength(2)

		const resultStatus = await sut.execute({
			currentDeliveryPersonId: undefined,
			currentLocationId: undefined,
			currentStatus: 'TRANSFER_PROCESS',
			receiverId: undefined,
			page: 1,
			perPage: 10,
		})

		// @ts-expect-error data does exists
		expect(resultStatus.value.data).toHaveLength(1)

		const resultReceiverId = await sut.execute({
			currentDeliveryPersonId: undefined,
			currentLocationId: undefined,
			currentStatus: undefined,
			receiverId: receiverTwo.id.toString(),
			page: 1,
			perPage: 10,
		})

		// @ts-expect-error data does exists
		expect(resultReceiverId.value.data).toHaveLength(2)
	})
})
