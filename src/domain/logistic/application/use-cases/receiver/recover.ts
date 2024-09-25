import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ReceiverRepository } from '../../repositories/receiver.repository'

interface RecoverReceiverUseCaseRequest {
	personId: string
}

type RecoverReceiverUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class RecoverReceiverUseCase {
	constructor(private receiverRepository: ReceiverRepository) {}

	async execute({
		personId,
	}: RecoverReceiverUseCaseRequest): Promise<RecoverReceiverUseCaseResponse> {
		const person = await this.receiverRepository.findById(personId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		await this.receiverRepository.recover(person)

		return right({})
	}
}
