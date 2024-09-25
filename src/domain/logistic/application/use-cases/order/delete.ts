import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { OrderRepository } from '../../repositories/order.repository'

interface DeleteOrderUseCaseRequest {
	orderId: string
}

type DeleteOrderUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class DeleteOrderUseCase {
	constructor(private orderRepository: OrderRepository) {}

	async execute({
		orderId,
	}: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
		const order = await this.orderRepository.findById(orderId)

		if (!order) {
			return left(new ResourceNotFoundError())
		}

		await this.orderRepository.delete(order)

		return right({})
	}
}
