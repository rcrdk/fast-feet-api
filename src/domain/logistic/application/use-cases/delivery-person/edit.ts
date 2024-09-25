import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { HashGenerator } from '../../cryptography/hash-generator'
import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'

interface EditDeliveryPersonUseCaseRequest {
	personId: string
	name: string
	documentNumber: string
	password?: string
	email: string
	phone: string
	city: string
	state: string
}

type EditDeliveryPersonUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class EditDeliveryPersonUseCase {
	constructor(
		private deliveryPersonRepository: DeliveryPersonRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		personId,
		name,
		documentNumber,
		password,
		email,
		phone,
		city,
		state,
	}: EditDeliveryPersonUseCaseRequest): Promise<EditDeliveryPersonUseCaseResponse> {
		const person = await this.deliveryPersonRepository.findById(personId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		const hashedPassword = password
			? await this.hashGenerator.hash(password)
			: undefined

		person.name = name
		person.documentNumber = documentNumber
		person.password = hashedPassword ?? person.password
		person.email = email
		person.phone = phone
		person.city = city
		person.state = state

		await this.deliveryPersonRepository.edit(person)

		return right({})
	}
}
