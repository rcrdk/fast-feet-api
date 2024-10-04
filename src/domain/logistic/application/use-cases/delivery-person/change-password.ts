import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { HashGenerator } from '../../cryptography/hash-generator'
import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'

interface ChangeDeliveryPersonPasswordUseCaseRequest {
	personId: string
	password: string
}

type ChangeDeliveryPersonPasswordUseCaseResponse = Either<
	ResourceNotFoundError,
	object
>

@Injectable()
export class ChangeDeliveryPersonPasswordUseCase {
	constructor(
		private deliveryPersonRepository: DeliveryPersonRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		personId,
		password,
	}: ChangeDeliveryPersonPasswordUseCaseRequest): Promise<ChangeDeliveryPersonPasswordUseCaseResponse> {
		const person = await this.deliveryPersonRepository.findById(personId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		person.password = await this.hashGenerator.hash(password)

		await this.deliveryPersonRepository.editPassword(person)

		return right({})
	}
}
