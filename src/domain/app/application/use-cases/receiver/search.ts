import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Receiver } from '@/domain/app/enterprise/entities/receiver'

import { ReceiverRepository } from '../../repositories/receiver.repository'
import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'

interface SearchReceiversUseCaseRequest {
	query: string
}

type SearchReceiversUseCaseResponse = Either<
	InvalidQueryLengthError,
	{
		receivers: Receiver[]
	}
>

@Injectable()
export class SearchReceiversUseCase {
	constructor(private receiverRepository: ReceiverRepository) {}

	async execute({
		query,
	}: SearchReceiversUseCaseRequest): Promise<SearchReceiversUseCaseResponse> {
		if (query.length < 4) {
			return left(new InvalidQueryLengthError(4))
		}

		// eslint-disable-next-line prettier/prettier
		const receivers = await this.receiverRepository.findManyBySearchQueries(query)

		return right({ receivers })
	}
}
