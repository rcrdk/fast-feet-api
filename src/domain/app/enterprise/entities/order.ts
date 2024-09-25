import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { OrderStatusCode } from '@/domain/types/statuses'

export interface OrderProps {
	creatorId: UniqueEntityId
	deliveryPersonId?: UniqueEntityId | null
	receiverId: UniqueEntityId
	postedAt: Date
	updatedAt?: Date | null
	currentStatusCode: OrderStatusCode
	city: string
	state: string
}

export class Order extends Entity<OrderProps> {
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

	get city() {
		return this.props.city
	}

	set city(city: string) {
		this.props.city = city
		this.touch()
	}

	get state() {
		return this.props.state
	}

	set state(state: string) {
		this.props.state = state
		this.touch()
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	static create(props: Optional<OrderProps, 'postedAt'>, id?: UniqueEntityId) {
		const order = new Order(
			{
				...props,
				currentStatusCode: props.currentStatusCode ?? 'POSTED',
				postedAt: props.postedAt ?? new Date(),
			},
			id,
		)

		return order
	}
}
