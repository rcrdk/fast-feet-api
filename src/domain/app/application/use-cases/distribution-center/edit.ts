import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DistributionCenterRepository } from '../../repositories/distribution-center.repository'

interface EditDistributionCenterUseCaseRequest {
	distributionCenterId: string
	name: string
	city: string
	state: string
}

type EditDistributionCenterUseCaseResponse = Either<
	ResourceNotFoundError,
	object
>

@Injectable()
export class EditDistributionCenterUseCase {
	constructor(
		private distributionCenterRepository: DistributionCenterRepository,
	) {}

	async execute({
		distributionCenterId,
		name,
		city,
		state,
	}: EditDistributionCenterUseCaseRequest): Promise<EditDistributionCenterUseCaseResponse> {
		// eslint-disable-next-line prettier/prettier
		const distributionCenter = await this.distributionCenterRepository.findById(distributionCenterId)

		if (!distributionCenter) {
			return left(new ResourceNotFoundError())
		}

		distributionCenter.name = name
		distributionCenter.city = city
		distributionCenter.state = state

		await this.distributionCenterRepository.edit(distributionCenter)

		return right({})
	}
}
