import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { PaginationData } from '@/core/repositories/pagination-data'
import { DistributionCenter } from '@/domain/logistic/enterprise/entities/distribution-center'

import { DistributionCenterRepository } from '../../repositories/distribution-center.repository'
import { InvalidQueryLengthError } from '../errors/invalid-query-length-error'

interface FetchDistributionCenterUseCaseRequest {
	query: string
	deleted?: boolean
	page: number
	perPage: number
}

type FetchDistributionCenterUseCaseResponse = Either<
	InvalidQueryLengthError,
	PaginationData<DistributionCenter[]>
>

@Injectable()
export class FetchDistributionCenterUseCase {
	constructor(
		private distributionCenterRepository: DistributionCenterRepository,
	) {}

	async execute({
		query,
		deleted = false,
		page,
		perPage,
	}: FetchDistributionCenterUseCaseRequest): Promise<FetchDistributionCenterUseCaseResponse> {
		if (query.length < 2) {
			return left(new InvalidQueryLengthError(2))
		}

		const result = await this.distributionCenterRepository.findManyByFilters({
			query,
			deleted,
			page,
			perPage,
		})

		return right(result)
	}
}
