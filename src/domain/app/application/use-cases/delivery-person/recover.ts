import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'

interface RecoverDeliveryPersonUseCaseRequest {
	personId: string
}

type RecoverDeliveryPersonUseCaseResponse = Either<
	ResourceNotFoundError,
	object
>

@Injectable()
export class RecoverDeliveryPersonUseCase {
	constructor(private deliveryPersonRepository: DeliveryPersonRepository) {}

	async execute({
		personId,
	}: RecoverDeliveryPersonUseCaseRequest): Promise<RecoverDeliveryPersonUseCaseResponse> {
		const person = await this.deliveryPersonRepository.findById(personId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		await this.deliveryPersonRepository.recover(person)

		return right({})
	}
}
