import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UserRoles } from '@/domain/types/roles'

export interface DeliveryPersonProps {
	name: string
	documentNumber: string
	password: string
	email: string
	phone: string
	city: string
	state: string
	role: UserRoles
	deletedAt?: Date | null
}

export class DeliveryPerson extends Entity<DeliveryPersonProps> {
	get name() {
		return this.props.name
	}

	set name(name: string) {
		this.props.name = name
	}

	get documentNumber() {
		return this.props.documentNumber
	}

	set documentNumber(documentNumber: string) {
		this.props.documentNumber = documentNumber
	}

	get password() {
		return this.props.password
	}

	set password(password: string) {
		this.props.password = password
	}

	get email() {
		return this.props.email
	}

	set email(email: string) {
		this.props.email = email
	}

	get phone() {
		return this.props.phone
	}

	set phone(phone: string) {
		this.props.phone = phone
	}

	get city() {
		return this.props.city
	}

	set city(city: string) {
		this.props.city = city
	}

	get state() {
		return this.props.state
	}

	set state(state: string) {
		this.props.state = state
	}

	get role() {
		return this.props.role
	}

	set role(role: UserRoles) {
		this.props.role = role
	}

	get deletedAt() {
		return this.props.deletedAt
	}

	deleted() {
		this.props.deletedAt = new Date()
	}

	static create(props: DeliveryPersonProps, id?: UniqueEntityId) {
		const person = new DeliveryPerson(props, id)

		return person
	}
}
