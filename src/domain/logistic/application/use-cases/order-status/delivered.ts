/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { AttachmentsRepository } from '../../repositories/attachments.repository'
import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { OrderRepository } from '../../repositories/order.repository'

interface SetOrderStatusDeliveredUseCaseRequest {
	orderId: string
	deliveryPersonId: string
	attachmentId: string
	details?: string | null
}

type SetOrderStatusDeliveredUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

@Injectable()
export class SetOrderStatusDeliveredUseCase {
	constructor(
		private orderRepository: OrderRepository,
		private deliveryPersonRepository: DeliveryPersonRepository,
		private attachmentsRepository: AttachmentsRepository,
	) {}

	async execute({
		orderId,
		deliveryPersonId,
		attachmentId,
		details,
	}: SetOrderStatusDeliveredUseCaseRequest): Promise<SetOrderStatusDeliveredUseCaseResponse> {
		if (!attachmentId) {
			return left(new ResourceNotFoundError())
		}

		const order = await this.orderRepository.findById(orderId)
		
		if (!order) {
			return left(new ResourceNotFoundError())
		}

		if (order.deliveryPersonId && deliveryPersonId !== order.deliveryPersonId.toString()) {
			return left(new UnauthorizedError())
		}
		
		const deliveryPerson = await this.deliveryPersonRepository.findById(deliveryPersonId)

		if (!deliveryPerson) {
			return left(new ResourceNotFoundError())
		}

		const attachment = await this.attachmentsRepository.findById(attachmentId)

		if (!attachment) {
			return left(new ResourceNotFoundError())
		}

		order.deliveryPersonId = new UniqueEntityId(deliveryPersonId)
		order.currentStatusCode = 'DELIVERED'
		
		await this.orderRepository.setStatusDelivered({
			order,
			details: details ?? null,
			attachmentId,
		})

		return right({})
	}
}
