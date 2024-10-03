import { makeDistributionCenter } from 'test/factories/make-distribution-center'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator.repository'
import { InMemoryDistributionCenterRepository } from 'test/repositories/in-memory-distribution-center.repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order.repository'
import { InMemoryOrderStatusRepository } from 'test/repositories/in-memory-order-status.repository'
import { InMemoryReceiverRepository } from 'test/repositories/in-memory-receiver.repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { InvalidSearchQueryError } from '../errors/invalid-search-queries-error'
import { FetchAvailableOrdersUseCase } from './fetch-available'

let inMemoryOrderStatusRepository: InMemoryOrderStatusRepository
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let inMemoryReceiverRepository: InMemoryReceiverRepository
let inMemoryDistributionCenterRepository: InMemoryDistributionCenterRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchAvailableOrdersUseCase

describe('fetch available orders to pickup', () => {
	beforeEach(() => {
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
		)
		sut = new FetchAvailableOrdersUseCase(inMemoryOrderRepository)
	})

	it('should be able to fetch available orders in a city', async () => {
		const distributionCenterOne = makeDistributionCenter(
			{
				city: 'Blumenau',
				state: 'SC',
			},
			new UniqueEntityId('dc-01'),
		)

		const distributionCenterTwo = makeDistributionCenter(
			{
				city: 'Curitiba',
				state: 'PR',
			},
			new UniqueEntityId('dc-02'),
		)

		await inMemoryDistributionCenterRepository.create(distributionCenterOne)
		await inMemoryDistributionCenterRepository.create(distributionCenterTwo)

		const newOrderOne = makeOrder(
			{
				currentLocationId: new UniqueEntityId('dc-01'),
				deliveryPersonId: new UniqueEntityId('teste'),
			},
			new UniqueEntityId('order-01'),
		)

		const newOrderTwo = makeOrder(
			{
				currentLocationId: new UniqueEntityId('dc-02'),
				deliveryPersonId: undefined,
			},
			new UniqueEntityId('order-02'),
		)

		const newOrderThree = makeOrder(
			{
				currentLocationId: new UniqueEntityId('dc-01'),
				deliveryPersonId: undefined,
			},
			new UniqueEntityId('order-03'),
		)

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
					id: new UniqueEntityId('order-03'),
				}),
			],
			totalItems: 1,
		})
	})

	it('should be able to fetch paginated available orders in a city', async () => {
		const distributionCenterOne = makeDistributionCenter(
			{
				city: 'Blumenau',
				state: 'SC',
			},
			new UniqueEntityId('dc-01'),
		)

		await inMemoryDistributionCenterRepository.create(distributionCenterOne)

		const newOrderOne = makeOrder(
			{
				currentLocationId: distributionCenterOne.id,
				deliveryPersonId: undefined,
			},
			new UniqueEntityId('order-01'),
		)

		const newOrderTwo = makeOrder(
			{
				currentLocationId: distributionCenterOne.id,
				deliveryPersonId: undefined,
			},
			new UniqueEntityId('order-02'),
		)

		const newOrderThree = makeOrder(
			{
				currentLocationId: distributionCenterOne.id,
				deliveryPersonId: undefined,
			},
			new UniqueEntityId('order-03'),
		)

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
					id: new UniqueEntityId('order-03'),
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
