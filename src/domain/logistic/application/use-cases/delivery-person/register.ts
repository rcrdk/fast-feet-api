import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { UserRoles } from '@/core/repositories/roles'
import { DeliveryPerson } from '@/domain/logistic/enterprise/entities/delivery-person'

import { HashGenerator } from '../../cryptography/hash-generator'
import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface RegisterDeliveryPersonUseCaseRequest {
	authRole: UserRoles
	name: string
	documentNumber: string
	password: string
	email: string
	phone: string
	city: string
	state: string
}

type RegisterDeliveryPersonUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		deliveryPerson: DeliveryPerson
	}
>

@Injectable()
export class RegisterDeliveryPersonUseCase {
	constructor(
		private deliveryPersonRepository: DeliveryPersonRepository,
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
	}: RegisterDeliveryPersonUseCaseRequest): Promise<RegisterDeliveryPersonUseCaseResponse> {
		if (authRole !== 'ADMINISTRATOR') {
			return left(new UnauthorizedError())
		}

		const personWithSameData = await this.deliveryPersonRepository.findByUnique(
			documentNumber,
			email,
		)

		if (personWithSameData) {
			return left(new UserAlreadyExistsError(personWithSameData.documentNumber))
		}

		const hashedPassword = await this.hashGenerator.hash(password)

		const deliveryPerson = DeliveryPerson.create({
			name,
			documentNumber,
			password: hashedPassword,
			email,
			phone,
			city,
			state,
			role: 'DELIVERY_PERSON',
		})

		await this.deliveryPersonRepository.create(deliveryPerson)

		return right({ deliveryPerson })
	}
}
