import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/app/enterprise/entities/order'

import { OrderRepository } from '../../repositories/order.repository'

interface ViewOrderUseCaseRequest {
	orderId: string
}

type ViewOrderUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		order: Order
	}
>

@Injectable()
export class ViewOrderUseCase {
	constructor(private orderRepository: OrderRepository) {}

	async execute({
		orderId,
	}: ViewOrderUseCaseRequest): Promise<ViewOrderUseCaseResponse> {
		const order = await this.orderRepository.findById(orderId)

		if (!order) {
			return left(new ResourceNotFoundError())
		}

		return right({ order })
	}
}
