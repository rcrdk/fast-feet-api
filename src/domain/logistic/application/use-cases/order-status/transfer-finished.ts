/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { OrderRepository } from '../../repositories/order.repository'

interface SetOrderStatusTransferFinishedUseCaseRequest {
	orderId: string
	deliveryPersonId: string
}

type SetOrderStatusTransferFinishedUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

@Injectable()
export class SetOrderStatusTransferFinishedUseCase {
	constructor(
		private orderRepository: OrderRepository,
		private deliveryPersonRepository: DeliveryPersonRepository,
	) {}

	async execute({
		orderId,
		deliveryPersonId,
	}: SetOrderStatusTransferFinishedUseCaseRequest): Promise<SetOrderStatusTransferFinishedUseCaseResponse> {
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
		order.currentStatusCode = 'TRANSFER_FINISHED'
		
		await this.orderRepository.setStatusTransferFinished(order)

		return right({})
	}
}
