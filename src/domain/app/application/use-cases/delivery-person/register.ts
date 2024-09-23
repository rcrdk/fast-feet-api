import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { DeliveryPerson } from '../../../enterprise/entities/delivery-person'
import { HashGenerator } from '../../cryptography/hash-generator'
import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface RegisterStudentUseCaseRequest {
	name: string
	documentNumber: string
	password: string
	email: string
	phone: string
	city: string
	state: string
}

type RegisterStudentUseCaseResponse = Either<
	UserAlreadyExistsError,
	{
		deliveryPerson: DeliveryPerson
	}
>

@Injectable()
export class RegisterStudentUseCase {
	constructor(
		private deliveryPersonRepository: DeliveryPersonRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		name,
		documentNumber,
		password,
		email,
		phone,
		city,
		state,
	}: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
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
