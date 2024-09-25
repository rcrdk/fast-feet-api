import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { Encrypter } from '../../cryptography/encrypter'
import { HashComparer } from '../../cryptography/hash-comparer'
import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface AuthenticateDeliveryPersonUseCaseRequest {
	documentNumber: string
	password: string
}

type AuthenticateDeliveryPersonUseCaseResponse = Either<
	InvalidCredentialsError | UnauthorizedError,
	{
		accessToken: string
	}
>

@Injectable()
export class AuthenticateDeliveryPersonUseCase {
	constructor(
		private deliveryPersonRepository: DeliveryPersonRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		documentNumber,
		password,
	}: AuthenticateDeliveryPersonUseCaseRequest): Promise<AuthenticateDeliveryPersonUseCaseResponse> {
		// eslint-disable-next-line prettier/prettier
		const person = await this.deliveryPersonRepository.findByDocumentNumber(documentNumber)

		if (!person) {
			return left(new InvalidCredentialsError())
		}

		if (person.role === 'ADMINISTRATOR' || person.deletedAt) {
			return left(new UnauthorizedError())
		}

		const hasValidPassword = await this.hashComparer.compare(
			password,
			person.password,
		)

		if (!hasValidPassword) {
			return left(new InvalidCredentialsError())
		}

		const accessToken = await this.encrypter.encrypt({
			role: person.role,
			sub: person.id.toString(),
		})

		return right({ accessToken })
	}
}
