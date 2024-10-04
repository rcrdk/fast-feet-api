import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
	UnauthorizedException,
} from '@nestjs/common'

import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { ViewOrderUseCase } from '@/domain/logistic/application/use-cases/order/view'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { OrderDetailsPresenter } from '../../presenters/order-details.presenter'

@Controller('/orders/view/:orderId')
export class ViewOrderController {
	constructor(private viewOrder: ViewOrderUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR', 'DELIVERY_PERSON')
	async handle(
		@Param('orderId', ParseUUIDPipe) orderId: string,
		@CurrentUser() user: UserPayload,
	) {
		const result = await this.viewOrder.execute({
			authPersonId: user.sub,
			authPersonRole: user.role,
			orderId,
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
			// eslint-disable-next-line prettier/prettier
			order: OrderDetailsPresenter.toHttp(result.value.order),
		}
	}
}
