import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { UserRoles } from '@/core/repositories/roles'
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { OrderRepository } from '../../repositories/order.repository'
import { ReceiverRepository } from '../../repositories/receiver.repository'

interface GetReceiverOrderUseCaseRequest {
	authPersonRole?: UserRoles
	authReceiverId?: string
	receiverId: string
	orderId: string
}

type GetReceiverOrderUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	{
		order: Order
	}
>

@Injectable()
export class GetReceiverOrderUseCase {
	constructor(
		private receiverRepository: ReceiverRepository,
		private orderRepository: OrderRepository,
	) {}

	async execute({
		authPersonRole,
		authReceiverId,
		receiverId,
		orderId,
	}: GetReceiverOrderUseCaseRequest): Promise<GetReceiverOrderUseCaseResponse> {
		if (!authPersonRole && !authReceiverId) {
			return left(new UnauthorizedError())
		}

		const receiver = await this.receiverRepository.findById(receiverId)

		if (!receiver || receiver.deletedAt) {
			return left(new ResourceNotFoundError())
		}

		// eslint-disable-next-line prettier/prettier
		const receiverPermission = receiver.id.toString() === authReceiverId && !authPersonRole
		const administratorPermission = authPersonRole === 'ADMINISTRATOR'

		if (receiverPermission || administratorPermission) {
			const order = await this.orderRepository.findByReceiver({
				receiverId: receiver.id.toString(),
				orderId,
			})

			if (!order) {
				return left(new ResourceNotFoundError())
			}

			return right({ order })
		}

		return left(new UnauthorizedError())
	}
}
