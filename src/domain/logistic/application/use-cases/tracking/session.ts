import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { Encrypter } from '../../cryptography/encrypter'
import { ReceiverRepository } from '../../repositories/receiver.repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface CreateReceiverSessionUseCaseRequest {
	documentNumber: string
}

type CreateReceiverSessionUseCaseResponse = Either<
	InvalidCredentialsError | UnauthorizedError,
	{
		accessToken: string
	}
>

@Injectable()
export class CreateReceiverSessionUseCase {
	constructor(
		private receiverRepository: ReceiverRepository,
		private encrypter: Encrypter,
	) {}

	async execute({
		documentNumber,
	}: CreateReceiverSessionUseCaseRequest): Promise<CreateReceiverSessionUseCaseResponse> {
		// eslint-disable-next-line prettier/prettier
		const receiver = await this.receiverRepository.findByDocumentNumber(documentNumber)

		if (!receiver || receiver.deletedAt) {
			return left(new InvalidCredentialsError())
		}

		const accessToken = await this.encrypter.encrypt({
			sub: receiver.id.toString(),
		})

		return right({ accessToken })
	}
}
