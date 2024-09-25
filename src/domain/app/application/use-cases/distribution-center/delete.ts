import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DistributionCenterRepository } from '../../repositories/distribution-center.repository'

interface DeleteDistributionCenterUseCaseRequest {
	distributionCenterId: string
}

type DeleteDistributionCenterUseCaseResponse = Either<
	ResourceNotFoundError,
	object
>

@Injectable()
export class DeleteDistributionCenterUseCase {
	constructor(
		private distributionCenterRepository: DistributionCenterRepository,
	) {}

	async execute({
		distributionCenterId,
	}: DeleteDistributionCenterUseCaseRequest): Promise<DeleteDistributionCenterUseCaseResponse> {
		const distributionCenter =
			await this.distributionCenterRepository.findById(distributionCenterId)

		if (!distributionCenter) {
			return left(new ResourceNotFoundError())
		}

		await this.distributionCenterRepository.delete(distributionCenter)

		return right({})
	}
}
