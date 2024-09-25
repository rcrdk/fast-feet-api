/* eslint-disable prettier/prettier */
import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { InvalidSearchQueryError } from '../errors/invalid-search-queries-error'
import { FetchAvailableOrdersUseCase } from './fetch-available'

let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchAvailableOrdersUseCase

describe('fetch available orders to pickup', () => {
	beforeEach(() => {
		inMemoryOrderStatusRepository = new InMemoryOrderStatusRepository()
		inMemoryDistributionCenterRepository = new InMemoryDistributionCenterRepository()
		inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryOrderStatusRepository, inMemoryDistributionCenterRepository)
		sut = new FetchAvailableOrdersUseCase(inMemoryOrderRepository)
	})

	it('should be able to fetch available orders in a city', async () => {
		const distributionCenterOne = makeDistributionCenter({
			city: 'Blumenau',
			state: 'SC',
		}, new UniqueEntityId('dc-01'))

		const distributionCenterTwo = makeDistributionCenter({
			city: 'Curitiba',
			state: 'PR',
		}, new UniqueEntityId('dc-02'))

		await inMemoryDistributionCenterRepository.create(distributionCenterOne)
		await inMemoryDistributionCenterRepository.create(distributionCenterTwo)

		const newOrderOne = makeOrder({
			originLocationId: distributionCenterOne.id,
			deliveryPersonId: new UniqueEntityId('teste'),
		}, new UniqueEntityId('order-01'))

		const newOrderTwo = makeOrder({
			originLocationId: distributionCenterTwo.id,
			deliveryPersonId: undefined,
		}, new UniqueEntityId('order-02'))

		const newOrderThree = makeOrder({
			originLocationId: distributionCenterOne.id,
			deliveryPersonId: undefined,
		}, new UniqueEntityId('order-03'))

		await inMemoryOrderRepository.create(newOrderOne)
		await inMemoryOrderRepository.create(newOrderTwo)
		await inMemoryOrderRepository.create(newOrderThree)

		const result = await sut.execute({
			city: 'Blu',
			state: 'SC',
			page: 1,
			perPage: 20,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			data: [
				expect.objectContaining({
					id: new UniqueEntityId('order-03')
				}),
			],
			totalItems: 1,
		})
	})

	it('should be able to fetch paginated available orders in a city', async () => {
		const distributionCenterOne = makeDistributionCenter({
			city: 'Blumenau',
			state: 'SC',
		}, new UniqueEntityId('dc-01'))

		await inMemoryDistributionCenterRepository.create(distributionCenterOne)

		const newOrderOne = makeOrder({
			originLocationId: distributionCenterOne.id,
			deliveryPersonId: undefined,
		}, new UniqueEntityId('order-01'))

		const newOrderTwo = makeOrder({
			originLocationId: distributionCenterOne.id,
			deliveryPersonId: undefined,
		}, new UniqueEntityId('order-02'))

		const newOrderThree = makeOrder({
			originLocationId: distributionCenterOne.id,
			deliveryPersonId: undefined,
		}, new UniqueEntityId('order-03'))

		await inMemoryOrderRepository.create(newOrderOne)
		await inMemoryOrderRepository.create(newOrderTwo)
		await inMemoryOrderRepository.create(newOrderThree)

		const result = await sut.execute({
			city: 'Blu',
			state: 'SC',
			page: 2,
			perPage: 2,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			data: [
				expect.objectContaining({
					id: new UniqueEntityId('order-03')
				}),
			],
			totalItems: 3,
		})
	})

	it('should not be able to fetch available orders without params', async () => {
		const result = await sut.execute({
			city: '',
			state: 'SC',
			page: 1,
			perPage: 20,
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidSearchQueryError)
	})
})
