import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface ReceiverDetailsProps {
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
	reference: string | null
	deletedAt: Date | null
}

export class ReceiverDetails extends ValueObject<ReceiverDetailsProps> {
	get receiverId() {
		return this.props.receiverId
	}

	get name() {
		return this.props.name
	}

	get documentNumber() {
		return this.props.documentNumber
	}

	get phone() {
		return this.props.phone
	}

	get email() {
		return this.props.email
	}

	get address() {
		return this.props.address
	}

	get city() {
		return this.props.city
	}

	get state() {
		return this.props.state
	}

	get neighborhood() {
		return this.props.neighborhood
	}

	get zipCode() {
		return this.props.zipCode
	}

	get reference() {
		return this.props.reference
	}

	get deletedAt() {
		return this.props.deletedAt
	}

	static create(props: ReceiverDetailsProps) {
		return new ReceiverDetails(props)
	}
}
