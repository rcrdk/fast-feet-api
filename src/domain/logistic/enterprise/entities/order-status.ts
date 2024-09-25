import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderStatusCode } from '@/core/repositories/statuses'
import { Optional } from '@/core/types/optional'

export interface OrderStatusProps {
	orderId: UniqueEntityId
	creatorId: UniqueEntityId
	currentLocationId?: UniqueEntityId | null
	attachmentId?: UniqueEntityId | null
	statusCode: OrderStatusCode
	details?: string | null
	updatedAt?: Date | null
}

export class OrderStatus extends Entity<OrderStatusProps> {
	get orderId() {
		return this.props.orderId
	}

	get creatorId() {
		return this.props.creatorId
	}

	get statusCode() {
		return this.props.statusCode
	}

	get details() {
		return this.props.details
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get currentLocationId() {
		return this.props.currentLocationId
	}

	set currentLocationId(currentLocationId: UniqueEntityId | null | undefined) {
		this.props.currentLocationId = currentLocationId
	}

	get attachmentId() {
		return this.props.attachmentId
	}

	set attachmentId(attachmentId: UniqueEntityId | null | undefined) {
		this.props.attachmentId = attachmentId
	}

	static create(
		props: Optional<OrderStatusProps, 'updatedAt'>,
		id?: UniqueEntityId,
	) {
		const orderStatus = new OrderStatus(
			{
				...props,
				updatedAt: props.updatedAt ?? new Date(),
			},
			id,
		)

		return orderStatus
	}
}
