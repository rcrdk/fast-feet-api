import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DistributionCenterRepository } from '../../repositories/distribution-center.repository'

interface RecoverDistributionCenterUseCaseRequest {
	distributionCenterId: string
}

type RecoverDistributionCenterUseCaseResponse = Either<
	ResourceNotFoundError,
	object
>

@Injectable()
export class RecoverDistributionCenterUseCase {
	constructor(
		private distributionCenterRepository: DistributionCenterRepository,
	) {}

	async execute({
		distributionCenterId,
	}: RecoverDistributionCenterUseCaseRequest): Promise<RecoverDistributionCenterUseCaseResponse> {
		// eslint-disable-next-line prettier/prettier
		const distributionCenter = await this.distributionCenterRepository.findById(distributionCenterId)

		if (!distributionCenter) {
			return left(new ResourceNotFoundError())
		}

		await this.distributionCenterRepository.recover(distributionCenter)

		return right({})
	}
}
