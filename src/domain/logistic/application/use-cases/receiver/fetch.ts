import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { PaginationData } from '@/core/repositories/pagination-data'
import { ReceiverDetails } from '@/domain/logistic/enterprise/entities/value-objects/receiver-details'

import { ReceiverRepository } from '../../repositories/receiver.repository'
import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'

interface FetchReceiversUseCaseRequest {
	query: string
	deleted?: boolean
	page: number
	perPage: number
}

type FetchReceiversUseCaseResponse = Either<
	InvalidQueryLengthError,
	PaginationData<ReceiverDetails[]>
>

@Injectable()
export class FetchReceiversUseCase {
	constructor(private receiverRepository: ReceiverRepository) {}

	async execute({
		query,
		deleted = false,
		page,
		perPage,
	}: FetchReceiversUseCaseRequest): Promise<FetchReceiversUseCaseResponse> {
		if (query.length < 2) {
			return left(new InvalidQueryLengthError(2))
		}

		const result = await this.receiverRepository.findManyByFilters({
			query,
			deleted,
			page,
			perPage,
		})

		return right(result)
	}
}
