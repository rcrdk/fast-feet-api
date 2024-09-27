/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { OrderRepository } from '../../repositories/order.repository'

interface ChangeDeliveryPersonUseCaseRequest {
	orderId: string
	deliveryPersonId?: string | null
	authPersonId: string
}

type ChangeDeliveryPersonUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

@Injectable()
export class ChangeDeliveryPersonUseCase {
	constructor(
		private orderRepository: OrderRepository,
		private deliveryPersonRepository: DeliveryPersonRepository,
	) {}

	async execute({
		orderId,
		deliveryPersonId,
		authPersonId,
	}: ChangeDeliveryPersonUseCaseRequest): Promise<ChangeDeliveryPersonUseCaseResponse> {
		const order = await this.orderRepository.findById(orderId)

		if (!order) {
			return left(new ResourceNotFoundError())
		}

		if (deliveryPersonId) {
			const deliveryPerson = await this.deliveryPersonRepository.findById(deliveryPersonId)

			if (!deliveryPerson) {
				return left(new ResourceNotFoundError())
			}

			order.deliveryPersonId = new UniqueEntityId(deliveryPersonId)
			order.currentStatusCode = 'PICKED'
		} else {
			order.deliveryPersonId = null
			order.currentStatusCode = 'AWAITING_PICK_UP'
		}

		await this.orderRepository.updateDeliveryPerson({
			data: order,
			authPersonId
		})

		return right({})
	}
}
