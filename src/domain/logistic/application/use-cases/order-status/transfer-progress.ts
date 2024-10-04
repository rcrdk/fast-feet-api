/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { DistributionCenterRepository } from '../../repositories/distribution-center.repository'
import { OrderRepository } from '../../repositories/order.repository'

interface SetOrderStatusTransferProgressUseCaseRequest {
	orderId: string
	deliveryPersonId: string
	nextLocationId: string
}

type SetOrderStatusTransferProgressUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	object
>

@Injectable()
export class SetOrderStatusTransferProgressUseCase {
	constructor(
		private orderRepository: OrderRepository,
		private deliveryPersonRepository: DeliveryPersonRepository,
		private distributionCenterRepository: DistributionCenterRepository,
	) {}

	async execute({
		orderId,
		deliveryPersonId,
		nextLocationId,
	}: SetOrderStatusTransferProgressUseCaseRequest): Promise<SetOrderStatusTransferProgressUseCaseResponse> {
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

		const nextLocation = await this.distributionCenterRepository.findById(nextLocationId)

		if (!nextLocation) {
			return left(new ResourceNotFoundError())
		}

		order.deliveryPersonId = new UniqueEntityId(deliveryPersonId)
		order.currentLocationId = new UniqueEntityId(nextLocationId)
		order.currentStatusCode = 'TRANSFER_PROGRESS'
		
		await this.orderRepository.setStatusTransferProgress(order)

		return right({})
	}
}
