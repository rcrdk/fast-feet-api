import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { PaginationData } from '@/core/repositories/pagination-data'
import { DeliveryPerson } from '@/domain/logistic/enterprise/entities/delivery-person'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { MinQuerySearchNotProviedError } from '../errors/expected-one-search-param-error'

interface SearchDeliveryPeopleUseCaseRequest {
	name?: string
	city?: string
	state?: string
	deleted?: boolean
	page: number
	perPage: number
}

type SearchDeliveryPeopleUseCaseResponse = Either<
	MinQuerySearchNotProviedError,
	PaginationData<DeliveryPerson[]>
>

@Injectable()
export class SearchDeliveryPeopleUseCase {
	constructor(private deliveryPersonRepository: DeliveryPersonRepository) {}

	async execute({
		name = '',
		city = '',
		state = '',
		deleted = false,
		page,
		perPage,
	}: SearchDeliveryPeopleUseCaseRequest): Promise<SearchDeliveryPeopleUseCaseResponse> {
		if (
			!(name || city || state) ||
			(name && name.length < 2) ||
			(city && city.length < 2) ||
			(state && state.length < 2)
		) {
			return left(new MinQuerySearchNotProviedError('name, city or state'))
		}

		const result = await this.deliveryPersonRepository.findManyByFilters({
			name,
			city,
			state,
			deleted,
			page,
			perPage,
		})

		return right(result)
	}
}
