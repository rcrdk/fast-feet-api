import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Query,
	UnauthorizedException,
} from '@nestjs/common'

import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { DeliveryPersonOrdersUseCase } from '@/domain/logistic/application/use-cases/delivery-person/orders'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationPagePipe } from '../../pipes/zod-validation-page.pipe'
import { ZodValidationPerPagePipe } from '../../pipes/zod-validation-per-page.pipe'
import { DeliveryPersonOrderItemPresenter } from '../../presenters/delivery-person-order-item.presenter'

@Controller('/delivery-people/:deliveryPersonId/orders')
export class DeliveryPersonOrdersController {
	constructor(private deliveryPersonOrders: DeliveryPersonOrdersUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR', 'DELIVERY_PERSON')
	async handle(
		@Param('deliveryPersonId', ParseUUIDPipe) deliveryPersonId: string,
		@Query('page', ZodValidationPagePipe) page: number,
		@Query('perPage', ZodValidationPerPagePipe) perPage: number,
		@CurrentUser() user: UserPayload,
	) {
		const result = await this.deliveryPersonOrders.execute({
			authPersonId: user.sub,
			authRole: user.role,
			deliveryPersonId,
			page,
			perPage,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case UnauthorizedError:
					throw new UnauthorizedException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		return {
			data: result.value.data.map((item) =>
				DeliveryPersonOrderItemPresenter.toHttp(item),
			),
			totalItems: result.value.totalItems,
			totalPages: result.value.totalPages,
			perPage: result.value.perPage,
		}
	}
}
