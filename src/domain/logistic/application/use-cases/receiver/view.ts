import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { ReceiverDetails } from '@/domain/logistic/enterprise/entities/value-objects/receiver-details'

import { ReceiverRepository } from '../../repositories/receiver.repository'

interface ViewReceiverUseCaseRequest {
	personId: string
}

type ViewReceiverUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		receiver: ReceiverDetails
	}
>

@Injectable()
export class ViewReceiverUseCase {
	constructor(private receiverRepository: ReceiverRepository) {}

	async execute({
		personId,
	}: ViewReceiverUseCaseRequest): Promise<ViewReceiverUseCaseResponse> {
		const receiver = await this.receiverRepository.findByIdWithDetails(personId)

		if (!receiver) {
			return left(new ResourceNotFoundError())
		}

		return right({ receiver })
	}
}
