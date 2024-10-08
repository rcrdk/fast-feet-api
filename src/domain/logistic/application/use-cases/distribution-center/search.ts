import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { DistributionCenterDetails } from '@/domain/logistic/enterprise/entities/value-objects/distribution-center-details'

import { DistributionCenterRepository } from '../../repositories/distribution-center.repository'
import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'

interface SearchDistributionCentersUseCaseRequest {
	query: string
	limit: number
}

type SearchDistributionCentersUseCaseResponse = Either<
	InvalidQueryLengthError,
	{
		distributionCenters: DistributionCenterDetails[]
	}
>

@Injectable()
export class SearchDistributionCentersUseCase {
	constructor(
		private distributionCenterRepository: DistributionCenterRepository,
	) {}

	async execute({
		query,
		limit,
	}: SearchDistributionCentersUseCaseRequest): Promise<SearchDistributionCentersUseCaseResponse> {
		if (query.length < 2) {
			return left(new InvalidQueryLengthError(2))
		}

		// eslint-disable-next-line prettier/prettier
		const distributionCenters = await this.distributionCenterRepository.findManyByQuery({
				query,
				limit,
			})

		return right({ distributionCenters })
	}
}
