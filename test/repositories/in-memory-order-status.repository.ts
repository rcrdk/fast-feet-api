import { OrderStatusRepository } from '@/domain/logistic/application/repositories/order-status.repository'
import { OrderStatus } from '@/domain/logistic/enterprise/entities/order-status'

export class InMemoryOrderStatusRepository implements OrderStatusRepository {
	public items: OrderStatus[] = []

	async create(data: OrderStatus) {
		this.items.push(data)
	}

	async deleteMany(orderId: string) {
		const statusesNotToDelete = this.items.filter((item) => {
			return item.orderId.toString() !== orderId
		})

		this.items = statusesNotToDelete
	}
}
