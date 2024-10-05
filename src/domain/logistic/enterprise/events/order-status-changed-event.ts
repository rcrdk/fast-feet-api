import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Order } from '../entities/order'

export class OrderStatusChangedEvent implements DomainEvent {
	public order: Order
	public ocurredAt: Date

	constructor(order: Order) {
		this.order = order
		this.ocurredAt = new Date()
	}

	getAggregateId(): UniqueEntityId {
		return this.order.id
	}
}
