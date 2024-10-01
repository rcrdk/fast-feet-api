import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { UserRoles } from '@/core/repositories/roles'

export interface DeliveryPersonDetailsProps {
	personId: UniqueEntityId
	role: UserRoles
	name: string
	documentNumber: string
	email: string
	phone: string
	city: string
	state: string
	deletedAt: Date | null
}

export class DeliveryPersonDetails extends ValueObject<DeliveryPersonDetailsProps> {
	get personId() {
		return this.props.personId
	}

	get role() {
		return this.props.role
	}

	get name() {
		return this.props.name
	}

	get documentNumber() {
		return this.props.documentNumber
	}

	get email() {
		return this.props.email
	}

	get phone() {
		return this.props.phone
	}

	get city() {
		return this.props.city
	}

	get state() {
		return this.props.state
	}

	get deletedAt() {
		return this.props.deletedAt
	}

	static create(props: DeliveryPersonDetailsProps) {
		return new DeliveryPersonDetails(props)
	}
}
