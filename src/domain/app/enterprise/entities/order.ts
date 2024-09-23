import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface OrderProps {
	deliveryPersonId: UniqueEntityId
	receiverId: UniqueEntityId
	attachmentId?: UniqueEntityId | null
	postedAt: Date
	retrievedAt?: Date | null
	deliveredAt?: Date | null
}

export class Order extends Entity<OrderProps> {
	get deliveryPersonId() {
		return this.props.deliveryPersonId
	}

	get receiverId() {
		return this.props.receiverId
	}

	get attachmentId() {
		return this.props.attachmentId
	}

	set attachmentId(attachmentId: UniqueEntityId | null | undefined) {
		this.props.attachmentId = attachmentId
	}

	get postedAt() {
		return this.props.postedAt
	}

	get retrievedAt() {
		return this.props.retrievedAt
	}

	get deliveredAt() {
		return this.props.deliveredAt
	}

	delivered() {
		this.props.deliveredAt = new Date()
	}

	posted() {
		this.props.postedAt = new Date()
	}

	retrieved() {
		this.props.retrievedAt = new Date()
	}

	static create(props: Optional<OrderProps, 'postedAt'>, id?: UniqueEntityId) {
		const order = new Order(
			{
				...props,
				postedAt: props.postedAt ?? new Date(),
			},
			id,
		)

		return order
	}
}
