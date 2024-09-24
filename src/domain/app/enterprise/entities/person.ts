import { Entity } from '@/core/entities/entity'
import { UserRoles } from '@/domain/types/roles'

export interface PersonProps {
	name: string
	documentNumber: string
	password: string
	email: string
	phone: string
	city: string
	state: string
	role: UserRoles
}

export class Person<Props extends PersonProps> extends Entity<Props> {
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
}
