import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { DistributionCenter } from '@/domain/logistic/enterprise/entities/distribution-center'

import { DistributionCenterRepository } from '../../repositories/distribution-center.repository'

interface CreateDistributionCenterUseCaseRequest {
	name: string
	city: string
	state: string
}

type CreateDistributionCenterUseCaseResponse = Either<
	null,
	{
		distributionCenter: DistributionCenter
	}
>

@Injectable()
export class CreateDistributionCenterUseCase {
	constructor(
		private distributionCenterRepository: DistributionCenterRepository,
	) {}

	async execute({
		name,

		city,
		state,
	}: CreateDistributionCenterUseCaseRequest): Promise<CreateDistributionCenterUseCaseResponse> {
		const distributionCenter = DistributionCenter.create({
			name,
			city,
			state,
		})

		await this.distributionCenterRepository.create(distributionCenter)

		return right({ distributionCenter })
	}
}
