import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Person, PersonProps } from './person'

export interface DeliveryPersonProps extends PersonProps {
	deletedAt?: Date | null
}

export class DeliveryPerson extends Person<DeliveryPersonProps> {
	get deletedAt() {
		return this.props.deletedAt
	}

	deletePerson() {
		this.props.deletedAt = new Date()
	}

	recoverPerson() {
		this.props.deletedAt = null
	}

	static create(props: DeliveryPersonProps, id?: UniqueEntityId) {
		const person = new DeliveryPerson(props, id)

		return person
	}
}
