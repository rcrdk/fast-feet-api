import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface EditDeliveryPersonUseCaseRequest {
	personId: string
	name: string
	documentNumber: string
	email: string
	phone: string
	city: string
	state: string
}

type EditDeliveryPersonUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class EditDeliveryPersonUseCase {
	constructor(private deliveryPersonRepository: DeliveryPersonRepository) {}

	async execute({
		personId,
		name,
		documentNumber,
		email,
		phone,
		city,
		state,
	}: EditDeliveryPersonUseCaseRequest): Promise<EditDeliveryPersonUseCaseResponse> {
		const person = await this.deliveryPersonRepository.findById(personId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		const personWithSameData = await this.deliveryPersonRepository.findByUnique(
			documentNumber,
			email,
		)

		if (personWithSameData && !personWithSameData?.id.equals(person.id)) {
			// eslint-disable-next-line prettier/prettier
			return left(new UserAlreadyExistsError(`'${personWithSameData.documentNumber}' or '${personWithSameData.email}'`))
		}

		person.name = name
		person.documentNumber = documentNumber
		person.email = email
		person.phone = phone
		person.city = city
		person.state = state

		await this.deliveryPersonRepository.edit(person)

		return right({})
	}
}
