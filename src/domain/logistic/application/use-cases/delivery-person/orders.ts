import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { PaginationData } from '@/core/repositories/pagination-data'
import { UserRoles } from '@/core/repositories/roles'
import { DeliveryPersonOrderItem } from '@/domain/logistic/enterprise/entities/value-objects/delivery-person-order-item'

import { DeliveryPersonRepository } from '../../repositories/delivery-person.repository'
import { OrderRepository } from '../../repositories/order.repository'

interface DeliveryPersonOrdersUseCaseRequest {
	authPersonId: string
	authRole: UserRoles
	deliveryPersonId: string
	page: number
	perPage: number
}

type DeliveryPersonOrdersUseCaseResponse = Either<
	ResourceNotFoundError,
	PaginationData<DeliveryPersonOrderItem[]>
>

@Injectable()
export class DeliveryPersonOrdersUseCase {
	constructor(
		private deliveryPersonRepository: DeliveryPersonRepository,
		private orderRepository: OrderRepository,
	) {}

	async execute({
		authPersonId,
		authRole,
		deliveryPersonId,
		page,
		perPage,
	}: DeliveryPersonOrdersUseCaseRequest): Promise<DeliveryPersonOrdersUseCaseResponse> {
		// eslint-disable-next-line prettier/prettier
		const person = await this.deliveryPersonRepository.findById(deliveryPersonId)

		if (!person) {
			return left(new ResourceNotFoundError())
		}

		if (
			person.id.toString() !== authPersonId &&
			person.role === 'DELIVERY_PERSON' &&
			authRole === 'DELIVERY_PERSON'
		) {
			return left(new UnauthorizedError())
		}

		const result = await this.orderRepository.findManyByDeliveryPerson({
			deliveryPersonId,
			page,
			perPage,
		})

		return right(result)
	}
}
