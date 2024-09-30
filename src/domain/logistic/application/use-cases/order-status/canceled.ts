/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { OrderRepository } from '../../repositories/order.repository'

interface SetOrderStatusCanceledUseCaseRequest {
	orderId: string
	deliveryPersonId: string
	details?: string | null
}

type SetOrderStatusCanceledUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

@Injectable()
export class SetOrderStatusCanceledUseCase {
	constructor(
		private orderRepository: OrderRepository,
		private deliveryPersonRepository: DeliveryPersonRepository,
	) {}

	async execute({
		orderId,
		deliveryPersonId,
		details,
	}: SetOrderStatusCanceledUseCaseRequest): Promise<SetOrderStatusCanceledUseCaseResponse> {
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

		order.deliveryPersonId = deliveryPerson.id
		order.currentStatusCode = 'CANCELED'
		
		await this.orderRepository.setStatusCanceled({
			order,
			details: details ?? null
		})

		return right({})
	}
}
