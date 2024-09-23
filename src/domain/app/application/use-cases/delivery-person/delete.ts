import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'

interface DeleteDeliveryPersonUseCaseRequest {
	personId: string
}

type DeleteDeliveryPersonUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class DeleteDeliveryPersonUseCase {
	constructor(private deliveryPersonRepository: DeliveryPersonRepository) {}

	async execute({
		personId,
	}: DeleteDeliveryPersonUseCaseRequest): Promise<DeleteDeliveryPersonUseCaseResponse> {
		const person = await this.deliveryPersonRepository.findById(personId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		person.deleted()

		await this.deliveryPersonRepository.delete(person)

		return right({})
	}
}
