/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { OrderRepository } from '../../repositories/order.repository'

interface SetOrderStatusOnRouteUseCaseRequest {
	orderId: string
	deliveryPersonId: string
	details?: string | null
}

type SetOrderStatusOnRouteUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

@Injectable()
export class SetOrderStatusOnRouteUseCase {
	constructor(
		private orderRepository: OrderRepository,
		private deliveryPersonRepository: DeliveryPersonRepository,
	) {}

	async execute({
		orderId,
		deliveryPersonId,
		details,
	}: SetOrderStatusOnRouteUseCaseRequest): Promise<SetOrderStatusOnRouteUseCaseResponse> {
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
		order.currentStatusCode = 'ON_ROUTE'
		
		await this.orderRepository.setStatusOnRoute({
			order,
			details: details ?? null
		})

		return right({})
	}
}
