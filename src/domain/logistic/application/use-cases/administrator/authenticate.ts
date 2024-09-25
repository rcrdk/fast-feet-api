import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { Encrypter } from '../../cryptography/encrypter'
import { HashComparer } from '../../cryptography/hash-comparer'
import { AdministratorRepository } from '../../repositories/administrator.repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface AuthenticateAdministratorUseCaseRequest {
	documentNumber: string
	password: string
}

type AuthenticateAdministratorUseCaseResponse = Either<
	InvalidCredentialsError | UnauthorizedError,
	{
		accessToken: string
	}
>

@Injectable()
export class AuthenticateAdministratorUseCase {
	constructor(
		private administratorRepository: AdministratorRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		documentNumber,
		password,
	}: AuthenticateAdministratorUseCaseRequest): Promise<AuthenticateAdministratorUseCaseResponse> {
		// eslint-disable-next-line prettier/prettier
		const administrator = await this.administratorRepository.findByDocumentNumber(documentNumber)

		if (!administrator) {
			return left(new InvalidCredentialsError())
		}

		if (administrator.role === 'DELIVERY_PERSON') {
			return left(new UnauthorizedError())
		}

		const hasValidPassword = await this.hashComparer.compare(
			password,
			administrator.password,
		)

		if (!hasValidPassword) {
			return left(new InvalidCredentialsError())
		}

		const accessToken = await this.encrypter.encrypt({
			role: administrator.role,
			sub: administrator.id.toString(),
		})

		return right({ accessToken })
	}
}
