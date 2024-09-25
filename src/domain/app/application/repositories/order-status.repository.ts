import { OrderStatus } from '../../enterprise/entities/order-status'

export abstract class OrderStatusRepository {
	abstract create(data: OrderStatus): Promise<void>
}
