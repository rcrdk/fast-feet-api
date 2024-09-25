import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DistributionCenter } from '@/domain/logistic/enterprise/entities/distribution-center'

import { DistributionCenterRepository } from '../../repositories/distribution-center.repository'

interface ViewDistributionCenterUseCaseRequest {
	distributionCenterId: string
}

type ViewDistributionCenterUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		distributionCenter: DistributionCenter
	}
>

@Injectable()
export class ViewDistributionCenterUseCase {
	constructor(
		private distributionCenterRepository: DistributionCenterRepository,
	) {}

	async execute({
		distributionCenterId,
	}: ViewDistributionCenterUseCaseRequest): Promise<ViewDistributionCenterUseCaseResponse> {
		// eslint-disable-next-line prettier/prettier
		const distributionCenter = await this.distributionCenterRepository.findById(distributionCenterId)

		if (!distributionCenter) {
			return left(new ResourceNotFoundError())
		}

		return right({ distributionCenter })
	}
}
