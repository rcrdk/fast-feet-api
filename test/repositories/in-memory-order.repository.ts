import { OrderRepository } from '@/domain/app/application/repositories/order.repository'
import { Order } from '@/domain/app/enterprise/entities/order'
import { OrderStatus } from '@/domain/app/enterprise/entities/order-status'

import { InMemoryOrderStatusRepository } from './in-memory-order-status.repository'

export class InMemoryOrderRepository implements OrderRepository {
	public items: Order[] = []

	constructor(private orderStatusRepository: InMemoryOrderStatusRepository) {}

	async create(data: Order) {
		this.items.push(data)

		this.orderStatusRepository.create(
			OrderStatus.create({
				orderId: data.id,
				creatorId: data.creatorId,
				statusCode: 'POSTED',
			}),
		)
	}
}
