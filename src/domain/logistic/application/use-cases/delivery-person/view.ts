import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeliveryPersonDetails } from '@/domain/logistic/enterprise/entities/value-objects/delivery-person-details'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'

interface ViewDeliveryPersonUseCaseRequest {
	personId: string
}

type ViewDeliveryPersonUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		deliveryPerson: DeliveryPersonDetails
	}
>

@Injectable()
export class ViewDeliveryPersonUseCase {
	constructor(private deliveryPersonRepository: DeliveryPersonRepository) {}

	async execute({
		personId,
	}: ViewDeliveryPersonUseCaseRequest): Promise<ViewDeliveryPersonUseCaseResponse> {
		// eslint-disable-next-line prettier/prettier
		const deliveryPerson = await this.deliveryPersonRepository.findByIdWithDetails(personId)

		if (!deliveryPerson) {
			return left(new ResourceNotFoundError())
		}

		return right({ deliveryPerson })
	}
}
