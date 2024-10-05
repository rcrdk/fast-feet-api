import { OrderStatus } from '../../enterprise/entities/order-status'

export abstract class OrderStatusRepository {
	abstract findById(id: string): Promise<OrderStatus | null>
	abstract create(data: OrderStatus): Promise<void>
	abstract deleteMany(orderId: string): Promise<void>
}
