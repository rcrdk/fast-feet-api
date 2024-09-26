/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { UserRoles } from '@/core/repositories/roles'
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { OrderRepository } from '../../repositories/order.repository'

interface ViewOrderUseCaseRequest {
	authPersonRole: UserRoles
	authPersonId: string
	orderId: string
}

type ViewOrderUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	{
		order: Order
	}
>

@Injectable()
export class ViewOrderUseCase {
	constructor(private orderRepository: OrderRepository) {}

	async execute({
		orderId,
		authPersonId,
		authPersonRole,
	}: ViewOrderUseCaseRequest): Promise<ViewOrderUseCaseResponse> {
		const order = await this.orderRepository.findById(orderId)

		if (!order) {
			return left(new ResourceNotFoundError())
		}

		const canAccessByAdministratorRole = authPersonRole === 'ADMINISTRATOR'
		const canAccessByDeliveryPerson = authPersonId === order.deliveryPersonId?.toString()
		const canAccessByAwaitingPickup = order.currentStatusCode === 'POSTED' || order.currentStatusCode === 'AWAITING_PICK_UP'

		if (canAccessByAdministratorRole || canAccessByAwaitingPickup || canAccessByDeliveryPerson) {
			return right({ order })
		}

		return left(new UnauthorizedError())
	}
}
