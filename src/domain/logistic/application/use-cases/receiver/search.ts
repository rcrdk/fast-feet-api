import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ReceiverDetails } from '@/domain/logistic/enterprise/entities/value-objects/receiver-details'

import { ReceiverRepository } from '../../repositories/receiver.repository'
import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'

interface SearchReceiversUseCaseRequest {
	query: string
	limit: number
}

type SearchReceiversUseCaseResponse = Either<
	InvalidQueryLengthError,
	{
		receivers: ReceiverDetails[]
	}
>

@Injectable()
export class SearchReceiversUseCase {
	constructor(private receiverRepository: ReceiverRepository) {}

	async execute({
		query,
		limit,
	}: SearchReceiversUseCaseRequest): Promise<SearchReceiversUseCaseResponse> {
		if (query.length < 2) {
			return left(new InvalidQueryLengthError('two'))
		}

		// eslint-disable-next-line prettier/prettier
		const receivers = await this.receiverRepository.findManyBySearchQueries({
			query,
			limit,
		})

		return right({ receivers })
	}
}
