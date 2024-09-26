import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { DeliveryPerson } from '@/domain/logistic/enterprise/entities/delivery-person'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'

interface SearchDeliveryPeopleUseCaseRequest {
	query: string
	limit: number
}

type SearchDeliveryPeopleUseCaseResponse = Either<
	InvalidQueryLengthError,
	{
		deliveryPeople: DeliveryPerson[]
	}
>

@Injectable()
export class SearchDeliveryPeopleUseCase {
	constructor(private deliveryPersonRepository: DeliveryPersonRepository) {}

	async execute({
		query,
		limit,
	}: SearchDeliveryPeopleUseCaseRequest): Promise<SearchDeliveryPeopleUseCaseResponse> {
		if (query.length < 2) {
			return left(new InvalidQueryLengthError('two'))
		}

		const deliveryPeople =
			await this.deliveryPersonRepository.findManyBySearchQueries({
				query,
				limit,
			})

		return right({ deliveryPeople })
	}
}
