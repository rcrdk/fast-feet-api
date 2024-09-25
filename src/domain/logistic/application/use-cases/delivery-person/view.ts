import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeliveryPerson } from '@/domain/logistic/enterprise/entities/delivery-person'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'

interface ViewDeliveryPersonUseCaseRequest {
	personId: string
}

type ViewDeliveryPersonUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		person: DeliveryPerson
	}
>

@Injectable()
export class ViewDeliveryPersonUseCase {
	constructor(private deliveryPersonRepository: DeliveryPersonRepository) {}

	async execute({
		personId,
	}: ViewDeliveryPersonUseCaseRequest): Promise<ViewDeliveryPersonUseCaseResponse> {
		const person = await this.deliveryPersonRepository.findById(personId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		person.password = ''

		return right({ person })
	}
}
