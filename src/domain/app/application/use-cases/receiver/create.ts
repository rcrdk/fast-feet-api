import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { Receiver } from '../../../enterprise/entities/receiver'
import { ReceiverRepository } from '../../repositories/receiver.repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface CreateReceiverUseCaseRequest {
	name: string
	documentNumber: string
	email: string
	phone: string
	address: string
	city: string
	state: string
	neighborhood: string
	zipCode: string
	reference?: string | null
}

type CreateReceiverUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		receiver: Receiver
	}
>

@Injectable()
export class CreateReceiverUseCase {
	constructor(private receiverRepository: ReceiverRepository) {}

	async execute({
		name,
		documentNumber,
		email,
		phone,
		address,
		city,
		state,
		neighborhood,
		zipCode,
		reference,
	}: CreateReceiverUseCaseRequest): Promise<CreateReceiverUseCaseResponse> {
		const personWithSameData = await this.receiverRepository.findByUnique(
			documentNumber,
			email,
		)

		if (personWithSameData) {
			return left(new UserAlreadyExistsError(personWithSameData.documentNumber))
		}

		const receiver = Receiver.create({
			name,
			documentNumber,
			email,
			phone,
			address,
			city,
			state,
			neighborhood,
			zipCode,
			reference: reference ?? null,
		})

		await this.receiverRepository.create(receiver)

		return right({ receiver })
	}
}
