import {
	FindManyByAvailabilityParams,
	OrderRepository,
	OrderWithLocation,
} from '@/domain/app/application/repositories/order.repository'
import { DistributionCenter } from '@/domain/app/enterprise/entities/distribution-center'
import { Order } from '@/domain/app/enterprise/entities/order'
import { OrderStatus } from '@/domain/app/enterprise/entities/order-status'

import { InMemoryDistributionCenterRepository } from './in-memory-distribution-center.repository'
import { InMemoryOrderStatusRepository } from './in-memory-order-status.repository'

export class InMemoryOrderRepository implements OrderRepository {
	public items: Order[] = []

	constructor(
		private orderStatusRepository: InMemoryOrderStatusRepository,
		private distributionCenterRepository: InMemoryDistributionCenterRepository,
	) {}

	async findById(orderId: string) {
		const order = this.items.find((item) => item.id.toString() === orderId)

		return order ?? null
	}

	async findManyByAvailability({
		city,
		state,
		page,
		perPage,
	}: FindManyByAvailabilityParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const allOrdersWithOriginLocation = this.items.map((item) => {
			const distributionCenter =
				this.distributionCenterRepository.items.find(
					(locale) => locale.id === item.currentLocationId,
				) ?? ({} as DistributionCenter)

			return {
				...item,
				distributionCenter,
			}
		}) as OrderWithLocation[]

		const ordersFiltered = allOrdersWithOriginLocation.filter((item) => {
			const location =
				item.distributionCenter.city === city &&
				item.distributionCenter.state === state

			const status =
				item.currentStatusCode === 'POSTED' ||
				item.currentStatusCode === 'AWAITING_PICK_UP'

			return location && status
		})

		return ordersFiltered
			.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
			.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END)
	}

	async create(data: Order) {
		this.items.push(data)

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: data.id,
				creatorId: data.creatorId,
				currentLocationId: data.originLocationId,
				statusCode: 'POSTED',
			}),
		)
	}

	async delete(data: Order) {
		const findIndex = this.items.findIndex((item) => item.id.equals(data.id))
		this.items.splice(findIndex, 1)

		const orderId = data.id.toString()
		this.orderStatusRepository.deleteMany(orderId)
	}
}
