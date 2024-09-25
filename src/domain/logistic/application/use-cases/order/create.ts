import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { OrderRepository } from '../../repositories/order.repository'

interface CreateOrderUseCaseRequest {
	creatorId: string
	deliveryPersonId?: string
	receiverId: string
	originDistributionCenterId: string
}

type CreateOrderUseCaseResponse = Either<
	null,
	{
		order: Order
	}
>

@Injectable()
export class CreateOrderUseCase {
	constructor(private orderRepository: OrderRepository) {}

	async execute({
		creatorId,
		deliveryPersonId,
		receiverId,
		originDistributionCenterId,
	}: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
		const order = Order.create({
			creatorId: new UniqueEntityId(creatorId),
			// eslint-disable-next-line prettier/prettier
			deliveryPersonId: deliveryPersonId ? new UniqueEntityId(deliveryPersonId) : null,
			receiverId: new UniqueEntityId(receiverId),
			originLocationId: new UniqueEntityId(originDistributionCenterId),
			currentStatusCode: 'POSTED',
		})

		await this.orderRepository.create(order)

		return right({ order })
	}
}
