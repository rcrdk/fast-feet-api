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
import { SetOrderStatusDeliveredUseCase } from '@/domain/logistic/application/use-cases/order-status/delivered'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

const setOrderStatusBodySchema = z.object({
	deliveryPersonId: z.string().uuid().optional(),
	attachmentId: z.string().uuid(),
	details: z.string().optional(),
})

type SetOrderStatusBodySchema = z.infer<typeof setOrderStatusBodySchema>
const bodyValidationPipe = new ZodValidationPipe(setOrderStatusBodySchema)

@Controller('/orders/:orderId/set-status/delivered')
export class SetOrderStatusDeliveredController {
	constructor(
		private setOrderStatusDelivered: SetOrderStatusDeliveredUseCase,
	) {}

	@Patch()
	@HttpCode(204)
	@Roles('ADMINISTRATOR', 'DELIVERY_PERSON')
	async handle(
		@Param('orderId', ParseUUIDPipe) orderId: string,
		@Body(bodyValidationPipe) body: SetOrderStatusBodySchema,
		@CurrentUser() user: UserPayload,
	) {
		const { deliveryPersonId, attachmentId, details } = body

		const result = await this.setOrderStatusDelivered.execute({
			deliveryPersonId: deliveryPersonId ?? user.sub,
			orderId,
			attachmentId,
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
