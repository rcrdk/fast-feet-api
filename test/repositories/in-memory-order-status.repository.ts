import { OrderStatusRepository } from '@/domain/app/application/repositories/order-status.repository'
import { OrderStatus } from '@/domain/app/enterprise/entities/order-status'

export class InMemoryOrderStatusRepository implements OrderStatusRepository {
	public items: OrderStatus[] = []

	async create(data: OrderStatus) {
		this.items.push(data)
	}
}
