import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { PaginationData } from '@/core/repositories/pagination-data'
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { OrderRepository } from '../../repositories/order.repository'
import { InvalidSearchQueryError } from '../errors/invalid-search-queries-error'

interface FetchAvailableOrdersUseCaseRequest {
	city: string
	state: string
	page: number
	perPage: number
}

type FetchAvailableOrdersUseCaseResponse = Either<
	InvalidSearchQueryError,
	PaginationData<Order[]>
>

@Injectable()
export class FetchAvailableOrdersUseCase {
	constructor(private orderRepository: OrderRepository) {}

	async execute({
		city,
		state,
		page,
		perPage,
	}: FetchAvailableOrdersUseCaseRequest): Promise<FetchAvailableOrdersUseCaseResponse> {
		if (!city || !state) {
			return left(new InvalidSearchQueryError('city or state'))
		}

		const result = await this.orderRepository.findManyByAvailability({
			city,
			state,
			page,
			perPage,
		})

		return right(result)
	}
}
