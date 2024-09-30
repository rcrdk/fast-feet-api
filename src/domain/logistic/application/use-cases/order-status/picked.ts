/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { OrderRepository } from '../../repositories/order.repository'

interface SetOrderStatusPickedUseCaseRequest {
	orderId: string
	deliveryPersonId: string
}

type SetOrderStatusPickedUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

@Injectable()
export class SetOrderStatusPickedUseCase {
	constructor(
		private orderRepository: OrderRepository,
		private deliveryPersonRepository: DeliveryPersonRepository,
	) {}

	async execute({
		orderId,
		deliveryPersonId,
	}: SetOrderStatusPickedUseCaseRequest): Promise<SetOrderStatusPickedUseCaseResponse> {
		const order = await this.orderRepository.findById(orderId)
		
		if (!order) {
			return left(new ResourceNotFoundError())
		}

		if (deliveryPersonId !== order.deliveryPersonId?.toString()) {
			return left(new UnauthorizedError())
		}
		
		const deliveryPerson = await this.deliveryPersonRepository.findById(deliveryPersonId)

		if (!deliveryPerson) {
			return left(new ResourceNotFoundError())
		}

		order.deliveryPersonId = new UniqueEntityId(deliveryPersonId)
		order.currentStatusCode = 'PICKED'
		
		await this.orderRepository.setStatusPicked(order)

		return right({})
	}
}
