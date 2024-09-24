import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { ReceiverRepository } from '../../repositories/receiver.repository'

interface DeleteReceiverUseCaseRequest {
	personId: string
}

type DeleteReceiverUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class DeleteReceiverUseCase {
	constructor(private receiverRepository: ReceiverRepository) {}

	async execute({
		personId,
	}: DeleteReceiverUseCaseRequest): Promise<DeleteReceiverUseCaseResponse> {
		const person = await this.receiverRepository.findById(personId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		await this.receiverRepository.delete(person)

		return right({})
	}
}
