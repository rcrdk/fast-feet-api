import { Order } from '../../enterprise/entities/order'

export abstract class OrderRepository {
	abstract create(data: Order): Promise<void>
}
