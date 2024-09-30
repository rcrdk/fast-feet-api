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

export type FindManyByReceiverParams = PaginationParams & {
	receiverId: string
}

export interface FindByReceiverParams {
	receiverId: string
	orderId: string
}

export interface UpdateDeliveryPersonParams {
	data: Order
	authPersonId: string
}

export type FindManyByFiltersParams = PaginationParams & {
	currentDeliveryPersonId?: string | null
	currentLocationId?: string | null
	currentStatus?: string | null
	receiverId?: string | null
	updatedFrom?: string | null
	updatedUntil?: string | null
}

export abstract class OrderRepository {
	abstract findById(orderId: string): Promise<Order | null>
	abstract findManyByAvailability(props: FindManyByAvailabilityParams): Promise<PaginationData<Order[]>>
	abstract findManyByDeliveryPerson(props: FindManyByDeliveryPersonParams): Promise<PaginationData<Order[]>>
	abstract findManyByReceiver(props: FindManyByReceiverParams): Promise<PaginationData<Order[]>>
	abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<Order[]>>
	abstract findByReceiver(props: FindByReceiverParams): Promise<Order | null>
	abstract create(data: Order): Promise<void>
	abstract updateDeliveryPerson(props: UpdateDeliveryPersonParams): Promise<void>
	abstract delete(data: Order): Promise<void>
	abstract setStatusPicked(data: Order): Promise<void>
	abstract setStatusTransferProgress(data: Order): Promise<void>
	abstract setStatusTransferFinished(data: Order): Promise<void>
}
