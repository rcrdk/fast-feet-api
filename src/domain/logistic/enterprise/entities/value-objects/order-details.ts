import { OrderStatusCode } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { UserRoles } from '@/core/repositories/roles'

export interface OrderDetailsProps {
	orderId: UniqueEntityId
	postedAt: Date
	updatedAt: Date
	currentStatusCode: OrderStatusCode
	creator: {
		creatorId: UniqueEntityId
		name: string
		documentNumber: string
		email: string
		phone: string
		city: string
		state: string
		role: UserRoles
	}
	originLocation: {
		originLocationId: UniqueEntityId
		name: string
		city: string
		state: string
	}
	currentLocation: null | {
		currentLocationId: UniqueEntityId
		name: string
		city: string
		state: string
	}
	deliveryPerson?: null | {
		personId: UniqueEntityId
		role: UserRoles
		name: string
		documentNumber: string
		email: string
		phone: string
		city: string
		state: string
	}
	receiver: {
		receiverId: UniqueEntityId
		name: string
		documentNumber: string
		phone: string
		email: string
		address: string
		city: string
		state: string
		neighborhood: string
		zipCode: string
		reference?: string | null
	}
	orderStatus: {
		statusCode: OrderStatusCode
		details?: string | null
		updatedAt?: Date | null
		creator: {
			creatorId: UniqueEntityId
			name: string
			documentNumber: string
			email: string
			phone: string
			city: string
			state: string
			role: UserRoles
		}
		currentLocation: null | {
			currentLocationId: UniqueEntityId
			name: string
			city: string
			state: string
		}
		attachments: {
			orderStatusId?: UniqueEntityId | null
			attachmentId: UniqueEntityId
			url: string
		}[]
	}[]
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {
	get orderId() {
		return this.props.orderId
	}

	get currentStatusCode() {
		return this.props.currentStatusCode
	}

	get postedAt() {
		return this.props.postedAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get creator() {
		return this.props.creator
	}

	get originLocation() {
		return this.props.originLocation
	}

	get currentLocation() {
		return this.props.currentLocation
	}

	get receiver() {
		return this.props.receiver
	}

	get deliveryPerson() {
		return this.props.deliveryPerson
	}

	get orderStatus() {
		return this.props.orderStatus
	}

	static create(props: OrderDetailsProps) {
		return new OrderDetails(props)
	}
}
