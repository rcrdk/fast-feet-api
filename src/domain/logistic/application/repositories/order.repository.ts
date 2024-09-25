/* eslint-disable prettier/prettier */
import { PaginationData } from '@/core/repositories/pagination-data'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { Order } from '../../enterprise/entities/order'

export type FindManyByAvailabilityParams = PaginationParams & {
	city: string
	state: string
}

export type FindManyByDeliveryPersonParams = PaginationParams & {
	deliveryPersonId: string
}

export abstract class OrderRepository {
	abstract findById(orderId: string): Promise<Order | null>
	abstract findManyByAvailability(props: FindManyByAvailabilityParams): Promise<PaginationData<Order[]>>
	abstract findManyByDeliveryPerson(props: FindManyByDeliveryPersonParams): Promise<PaginationData<Order[]>>
	abstract create(data: Order): Promise<void>
	abstract delete(data: Order): Promise<void>
}
