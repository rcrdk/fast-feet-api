import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Receiver } from '@/domain/app/enterprise/entities/receiver'

import { ReceiverRepository } from '../../repositories/receiver.repository'

interface ViewReceiverUseCaseRequest {
	personId: string
}

type ViewReceiverUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		receiver: Receiver
	}
>

@Injectable()
export class ViewReceiverUseCase {
	constructor(private receiverRepository: ReceiverRepository) {}

	async execute({
		personId,
	}: ViewReceiverUseCaseRequest): Promise<ViewReceiverUseCaseResponse> {
		const receiver = await this.receiverRepository.findById(personId)

		if (!receiver) {
			return left(new ResourceNotFoundError())
		}

		return right({ receiver })
	}
}
