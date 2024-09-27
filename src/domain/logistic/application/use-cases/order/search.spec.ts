/* eslint-disable prettier/prettier */
import dayjs from 'dayjs'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { InvalidDateError } from '../errors/invalid-date-error'
import { InvalidDatePeriodError } from '../errors/invalid-date-period-error'
import { SearchOrdersUseCase } from './search'

let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: SearchOrdersUseCase

describe('search orders', () => {
	beforeEach(() => {
		inMemoryOrderStatusRepository = new InMemoryOrderStatusRepository()
		inMemoryDistributionCenterRepository = new InMemoryDistributionCenterRepository()
		inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderStatusRepository, inMemoryDistributionCenterRepository)
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
		for (let i = 10; i <= 30; i++) {
			await inMemoryOrderRepository.create(
				makeOrder({
					updatedAt: new Date(`2024-01-${i} 12:00:00`)
				}, new UniqueEntityId(`id-2024-01-${i}`))
			)
		}

		const result = await sut.execute({
			updatedFrom: dayjs('2024-01-21').toString(),
			updatedUntil: dayjs('2024-01-23').toString(),
			page: 1,
			perPage: 10,
		})

		expect(result.value).toMatchObject({
			totalItems: 3
		})

		// @ts-expect-error data does exists
		expect(result.value.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-23'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-22'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-22'),
				}),
			])
		)
	})

	it('should be able to search for orders last updated from a date', async () => {
		for (let i = 10; i <= 30; i++) {
			await inMemoryOrderRepository.create(
				makeOrder({
					updatedAt: new Date(`2024-01-${i} 12:00:00`)
				}, new UniqueEntityId(`id-2024-01-${i}`))
			)
		}

		const result = await sut.execute({
			updatedFrom: dayjs('2024-01-26').toString(),
			updatedUntil: undefined,
			page: 1,
			perPage: 10,
		})

		expect(result.value).toMatchObject({
			totalItems: 5
		})

		// @ts-expect-error data does exists
		expect(result.value.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-26'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-27'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-28'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-29'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-30'),
				}),
			])
		)
	})

	it('should be able to search for orders last updated until a date', async () => {
		for (let i = 10; i <= 30; i++) {
			await inMemoryOrderRepository.create(
				makeOrder({
					updatedAt: new Date(`2024-01-${i} 12:00:00`)
				}, new UniqueEntityId(`id-2024-01-${i}`))
			)
		}

		const result = await sut.execute({
			updatedFrom: undefined,
			updatedUntil: dayjs('2024-01-14').toString(),
			page: 1,
			perPage: 10,
		})

		expect(result.value).toMatchObject({
			totalItems: 5
		})

		// @ts-expect-error data does exists
		expect(result.value.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-14'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-13'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-12'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-11'),
				}),
				expect.objectContaining({
					id: new UniqueEntityId('id-2024-01-10'),
				}),
			])
		)
	})

	it('should be able to search for orders paginated', async () => {
		for (let i = 10; i <= 30; i++) {
			await inMemoryOrderRepository.create(
				makeOrder({
					updatedAt: new Date(`2024-01-${i} 12:00:00`)
				}, new UniqueEntityId(`id-2024-01-${i}`))
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
		const orderOne = makeOrder({
			deliveryPersonId: new UniqueEntityId('person-01'),
			currentLocationId: new UniqueEntityId('center-01'),
			currentStatusCode: 'TRANSFER_PROCESS',
			receiverId: new UniqueEntityId('receiver-01'),
		})

		const orderTwo = makeOrder({
			deliveryPersonId: new UniqueEntityId('person-02'),
			currentLocationId: new UniqueEntityId('center-01'),
			currentStatusCode: 'PICKED',
			receiverId: new UniqueEntityId('receiver-02'),
		})

		const orderThree = makeOrder({
			deliveryPersonId: new UniqueEntityId('person-03'),
			currentLocationId: new UniqueEntityId('center-03'),
			currentStatusCode: 'ON_ROUTE',
			receiverId: new UniqueEntityId('receiver-02'),
		})

		inMemoryOrderRepository.items.push(orderOne)
		inMemoryOrderRepository.items.push(orderTwo)
		inMemoryOrderRepository.items.push(orderThree)

		const resultDeliveryPerson = await sut.execute({
			currentDeliveryPersonId: 'person-01',
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
			currentLocationId: 'center-01',
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
			receiverId: 'receiver-02',
			page: 1,
			perPage: 10,
		})

		// @ts-expect-error data does exists
		expect(resultReceiverId.value.data).toHaveLength(2)
	})
})
