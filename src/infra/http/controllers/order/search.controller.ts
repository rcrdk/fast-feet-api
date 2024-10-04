/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common'

import { OrderStatusCode } from '@/core/repositories/statuses'
import { InvalidDateError } from '@/domain/logistic/application/use-cases/errors/invalid-date-error'
import { InvalidDatePeriodError } from '@/domain/logistic/application/use-cases/errors/invalid-date-period-error'
import { SearchOrdersUseCase } from '@/domain/logistic/application/use-cases/order/search'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationPagePipe } from '../../pipes/zod-validation-page.pipe'
import { ZodValidationPerPagePipe } from '../../pipes/zod-validation-per-page.pipe'
import { SearchOrderItemPresenter } from '../../presenters/search-order-item.presenter'

@Controller('/orders/search')
export class SearchOrdersController {
	constructor(private searchOrders: SearchOrdersUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Query('page', ZodValidationPagePipe) page: number,
		@Query('perPage', ZodValidationPerPagePipe) perPage: number,
		@Query('currentDeliveryPersonId', new ParseUUIDPipe({ optional: true })) currentDeliveryPersonId?: string,
		@Query('currentLocationId', new ParseUUIDPipe({ optional: true })) currentLocationId?: string,
		@Query('receiverId', new ParseUUIDPipe({ optional: true })) receiverId?: string,
		@Query('currentStatus') currentStatus?: OrderStatusCode,
		@Query('updatedFrom') updatedFrom?: string,
		@Query('updatedUntil') updatedUntil?: string,
	) {
		const result = await this.searchOrders.execute({
			currentDeliveryPersonId,
			currentStatus,
			currentLocationId,
			receiverId,
			updatedFrom,
			updatedUntil,
			page,
			perPage,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case InvalidDateError:
					throw new BadRequestException(error.message)
				case InvalidDatePeriodError:
					throw new BadRequestException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		return {
			data: result.value.data.map((item) =>
				SearchOrderItemPresenter.toHttp(item),
			),
			totalItems: result.value.totalItems,
			totalPages: result.value.totalPages,
			perPage: result.value.perPage,
		}
	}
}
