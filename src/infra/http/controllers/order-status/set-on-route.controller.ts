import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Patch,
	UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { SetOrderStatusOnRouteUseCase } from '@/domain/logistic/application/use-cases/order-status/on-route'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

const setOrderStatusBodySchema = z.object({
	deliveryPersonId: z.string().uuid(),
	details: z.string().optional(),
})

type SetOrderStatusBodySchema = z.infer<typeof setOrderStatusBodySchema>
const bodyValidationPipe = new ZodValidationPipe(setOrderStatusBodySchema)

@Controller('/orders/:orderId/set-status/on-route')
export class SetOrderStatusOnRouteController {
	constructor(private setOrderStatusOnRoute: SetOrderStatusOnRouteUseCase) {}

	@Patch()
	@HttpCode(204)
	@Roles('ADMINISTRATOR', 'DELIVERY_PERSON')
	async handle(
		@Param('orderId', ParseUUIDPipe) orderId: string,
		@Body(bodyValidationPipe) body: SetOrderStatusBodySchema,
	) {
		const { deliveryPersonId, details } = body

		const result = await this.setOrderStatusOnRoute.execute({
			deliveryPersonId,
			orderId,
			details,
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
	}
}
