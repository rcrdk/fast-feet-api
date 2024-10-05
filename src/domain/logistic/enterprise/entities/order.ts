import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderStatusCode } from '@/core/repositories/statuses'
import { Optional } from '@/core/types/optional'

import { OrderStatusChangedEvent } from '../events/order-status-changed-event'

export interface OrderProps {
	creatorId: UniqueEntityId
	deliveryPersonId?: UniqueEntityId | null
	originLocationId: UniqueEntityId
	currentLocationId: UniqueEntityId
	receiverId: UniqueEntityId
	postedAt: Date
	updatedAt: Date
	currentStatusCode: OrderStatusCode
}

export class Order extends AggregateRoot<OrderProps> {
	get creatorId() {
		return this.props.creatorId
	}

	get deliveryPersonId() {
		return this.props.deliveryPersonId
	}

	set deliveryPersonId(deliveryPersonId: UniqueEntityId | null | undefined) {
		this.props.deliveryPersonId = deliveryPersonId ?? null
		this.touch()
	}

	get originLocationId() {
		return this.props.originLocationId
	}

	get currentLocationId() {
		return this.props.currentLocationId
	}

	set currentLocationId(currentLocationId: UniqueEntityId) {
		this.props.currentLocationId = currentLocationId ?? null
		this.touch()
	}

	get receiverId() {
		return this.props.receiverId
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get postedAt() {
		return this.props.postedAt
	}

	get currentStatusCode() {
		return this.props.currentStatusCode
	}

	set currentStatusCode(currentStatusCode: OrderStatusCode) {
		this.props.currentStatusCode = currentStatusCode
		this.touch()
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<OrderProps, 'postedAt' | 'updatedAt' | 'currentLocationId'>,
		id?: UniqueEntityId,
	) {
		const order = new Order(
			{
				...props,
				currentLocationId: props.currentLocationId ?? props.originLocationId,
				currentStatusCode: props.currentStatusCode ?? 'POSTED',
				postedAt: props.postedAt ?? new Date(),
				updatedAt: props.updatedAt ?? props.postedAt ?? new Date(),
			},
			id,
		)

		order.addDomainEvent(new OrderStatusChangedEvent(order))

		return order
	}
}
