import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { UserRoles } from '@/core/repositories/roles'
import { Administrator } from '@/domain/logistic/enterprise/entities/administrator'

import { HashGenerator } from '../../cryptography/hash-generator'
import { AdministratorRepository } from '../../repositories/administrator.repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface RegisterAdministratorUseCaseRequest {
	authRole: UserRoles
	name: string
	documentNumber: string
	password: string
	email: string
	phone: string
	city: string
	state: string
}

type RegisterAdministratorUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		administrator: Administrator
	}
>

@Injectable()
export class RegisterAdministratorUseCase {
	constructor(
		private administratorRepository: AdministratorRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		authRole,
		name,
		documentNumber,
		password,
		email,
		phone,
		city,
		state,
	}: RegisterAdministratorUseCaseRequest): Promise<RegisterAdministratorUseCaseResponse> {
		if (authRole !== 'ADMINISTRATOR') {
			return left(new UnauthorizedError())
		}

		const personWithSameData = await this.administratorRepository.findByUnique(
			documentNumber,
			email,
		)

		if (personWithSameData) {
			return left(new UserAlreadyExistsError(personWithSameData.documentNumber))
		}

		const hashedPassword = await this.hashGenerator.hash(password)

		const administrator = Administrator.create({
			name,
			documentNumber,
			password: hashedPassword,
			email,
			phone,
			city,
			state,
			role: 'ADMINISTRATOR',
		})

		await this.administratorRepository.create(administrator)

		return right({ administrator })
	}
}
