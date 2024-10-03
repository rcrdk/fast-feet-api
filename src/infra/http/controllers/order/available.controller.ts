import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common'

import { InvalidSearchQueryError } from '@/domain/logistic/application/use-cases/errors/invalid-search-queries-error'
import { FetchAvailableOrdersUseCase } from '@/domain/logistic/application/use-cases/order/fetch-available'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationPagePipe } from '../../pipes/zod-validation-page.pipe'
import { ZodValidationPerPagePipe } from '../../pipes/zod-validation-per-page.pipe'
import { AvailableOrderItemPresenter } from '../../presenters/available-order-item.presenter'

@Controller('/orders/available')
export class FetchAvailableOrdersController {
	constructor(private fetchAvailableOrders: FetchAvailableOrdersUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR', 'DELIVERY_PERSON')
	async handle(
		@Query('city') city: string,
		@Query('state') state: string,
		@Query('page', ZodValidationPagePipe) page: number,
		@Query('perPage', ZodValidationPerPagePipe) perPage: number,
	) {
		const result = await this.fetchAvailableOrders.execute({
			city,
			state,
			page,
			perPage,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case InvalidSearchQueryError:
					throw new BadRequestException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		return {
			data: result.value.data.map((item) =>
				AvailableOrderItemPresenter.toHttp(item),
			),
			totalItems: result.value.totalItems,
			totalPages: result.value.totalPages,
			perPage: result.value.perPage,
		}
	}
}
