import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { PaginationData } from '@/core/repositories/pagination-data'
import { UserRoles } from '@/core/repositories/roles'
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { OrderRepository } from '../../repositories/order.repository'
import { ReceiverRepository } from '../../repositories/receiver.repository'

interface FetchReceiverOrdersUseCaseRequest {
	authPersonRole?: UserRoles
	authReceiverId?: string
	receiverId: string
	page: number
	perPage: number
}

type FetchReceiverOrdersUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	PaginationData<Order[]>
>

@Injectable()
export class FetchReceiverOrdersUseCase {
	constructor(
		private receiverRepository: ReceiverRepository,
		private orderRepository: OrderRepository,
	) {}

	async execute({
		authPersonRole,
		authReceiverId,
		receiverId,
		page,
		perPage,
	}: FetchReceiverOrdersUseCaseRequest): Promise<FetchReceiverOrdersUseCaseResponse> {
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
			const orders = await this.orderRepository.findManyByReceiver({
				receiverId: receiver.id.toString(),
				page,
				perPage,
			})

			return right(orders)
		}

		return left(new UnauthorizedError())
	}
}
