/* eslint-disable prettier/prettier */
import { PaginationParams } from '@/core/repositories/pagination-params'

import { DistributionCenter } from '../../enterprise/entities/distribution-center'
import { Order } from '../../enterprise/entities/order'

export interface OrderWithLocation extends Order {
	distributionCenter: DistributionCenter
}

export type FindManyByAvailabilityParams = PaginationParams & {
	city: string
	state: string
}

export abstract class OrderRepository {
	abstract findById(orderId: string): Promise<Order | null>
	abstract findManyByAvailability(props: FindManyByAvailabilityParams): Promise<OrderWithLocation[]>
	abstract create(data: Order): Promise<void>
	abstract delete(data: Order): Promise<void>
}
