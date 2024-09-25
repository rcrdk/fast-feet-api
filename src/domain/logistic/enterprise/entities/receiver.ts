import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface ReceiverProps {
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
	deletedAt?: Date | null
}

export class Receiver extends Entity<ReceiverProps> {
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

	get address() {
		return this.props.address
	}

	set address(address: string) {
		this.props.address = address
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

	get neighborhood() {
		return this.props.neighborhood
	}

	set neighborhood(neighborhood: string) {
		this.props.neighborhood = neighborhood
	}

	get zipCode() {
		return this.props.zipCode
	}

	set zipCode(zipCode: string) {
		this.props.zipCode = zipCode
	}

	get reference() {
		return this.props.reference
	}

	set reference(reference: string | null | undefined) {
		this.props.reference = reference
	}

	get deletedAt() {
		return this.props.deletedAt
	}

	deleteReceiver() {
		this.props.deletedAt = new Date()
	}

	recoverReceiver() {
		this.props.deletedAt = null
	}

	static create(props: ReceiverProps, id?: UniqueEntityId) {
		const person = new Receiver(props, id)

		return person
	}
}
