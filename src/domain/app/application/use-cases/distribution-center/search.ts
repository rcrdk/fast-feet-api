import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { DistributionCenter } from '@/domain/app/enterprise/entities/distribution-center'

import { DistributionCenterRepository } from '../../repositories/distribution-center.repository'
import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'

interface SearchDistributionCentersUseCaseRequest {
	query: string
}

type SearchDistributionCentersUseCaseResponse = Either<
	InvalidQueryLengthError,
	{
		distributionCenters: DistributionCenter[]
	}
>

@Injectable()
export class SearchDistributionCentersUseCase {
	constructor(
		private distributionCenterRepository: DistributionCenterRepository,
	) {}

	async execute({
		query,
	}: SearchDistributionCentersUseCaseRequest): Promise<SearchDistributionCentersUseCaseResponse> {
		if (query.length < 2) {
			return left(new InvalidQueryLengthError(2))
		}

		// eslint-disable-next-line prettier/prettier
		const distributionCenters = await this.distributionCenterRepository.findManyByQuery(query)

		return right({ distributionCenters })
	}
}
