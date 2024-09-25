import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ReceiverRepository } from '../../repositories/receiver.repository'

interface EditReceiverUseCaseRequest {
	personId: string
	name: string
	documentNumber: string
	email: string
	phone: string
	address: string
	city: string
	state: string
	neighborhood: string
	zipCode: string
	reference?: string | null
}

type EditReceiverUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class EditReceiverUseCase {
	constructor(private receiverRepository: ReceiverRepository) {}

	async execute({
		personId,
		name,
		documentNumber,
		email,
		phone,
		address,
		city,
		state,
		neighborhood,
		zipCode,
		reference,
	}: EditReceiverUseCaseRequest): Promise<EditReceiverUseCaseResponse> {
		const person = await this.receiverRepository.findById(personId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		person.name = name
		person.documentNumber = documentNumber
		person.email = email
		person.phone = phone
		person.address = address
		person.city = city
		person.state = state
		person.neighborhood = neighborhood
		person.zipCode = zipCode
		person.reference = reference ?? null

		await this.receiverRepository.edit(person)

		return right({})
	}
}
