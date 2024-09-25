import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/app/enterprise/entities/order'

import { OrderRepository } from '../../repositories/order.repository'

interface CreateOrderUseCaseRequest {
	creatorId: string
	deliveryPersonId?: string
	receiverId: string
	city: string
	state: string
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
		city,
		state,
	}: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
		const order = Order.create({
			creatorId: new UniqueEntityId(creatorId),
			deliveryPersonId: deliveryPersonId
				? new UniqueEntityId(deliveryPersonId)
				: null,
			receiverId: new UniqueEntityId(receiverId),
			city,
			state,
			currentStatusCode: 'POSTED',
		})

		await this.orderRepository.create(order)

		return right({ order })
	}
}
