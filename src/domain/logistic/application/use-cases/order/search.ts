import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import { Either, left, right } from '@/core/either'
import { PaginationData } from '@/core/repositories/pagination-data'
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { OrderRepository } from '../../repositories/order.repository'
import { InvalidDateError } from '../errors/invalid-date-error'
import { InvalidDatePeriodError } from '../errors/invalid-date-period-error'

dayjs.extend(isSameOrBefore)

interface SearchOrdersUseCaseRequest {
	currentDeliveryPersonId?: string | null
	currentLocationId?: string | null
	currentStatus?: string | null
	receiverId?: string | null
	updatedFrom?: string | null
	updatedUntil?: string | null
	page: number
	perPage: number
}

type SearchOrdersUseCaseResponse = Either<
	InvalidDateError,
	PaginationData<Order[]>
>

@Injectable()
export class SearchOrdersUseCase {
	constructor(private orderRepository: OrderRepository) {}

	async execute({
		currentDeliveryPersonId,
		currentLocationId,
		currentStatus,
		receiverId,
		updatedFrom,
		updatedUntil,
		page,
		perPage,
	}: SearchOrdersUseCaseRequest): Promise<SearchOrdersUseCaseResponse> {
		if (updatedFrom && !dayjs(updatedFrom).isValid())
			return left(new InvalidDateError(updatedFrom, 'updatedFrom'))

		if (updatedUntil && !dayjs(updatedUntil).isValid())
			return left(new InvalidDateError(updatedUntil, 'updatedUntil'))

		if (updatedFrom && updatedUntil) {
			const dateStart = dayjs(updatedFrom).startOf('day')
			const dateEnd = dayjs(updatedUntil).endOf('day')
			const isInvalidPeriod = !dayjs(dateStart).isSameOrBefore(dateEnd)

			if (isInvalidPeriod) {
				return left(
					new InvalidDatePeriodError(
						dateStart.toISOString(),
						dateEnd.toISOString(),
					),
				)
			}
		}

		const result = await this.orderRepository.findManyByFilters({
			currentDeliveryPersonId,
			currentLocationId,
			currentStatus,
			receiverId,
			updatedFrom,
			updatedUntil,
			page,
			perPage,
		})

		return right(result)
	}
}
