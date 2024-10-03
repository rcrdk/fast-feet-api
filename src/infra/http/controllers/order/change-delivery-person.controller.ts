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
import { ChangeDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/order/change-delivery-person'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

const changeDeliveryPersonBodySchema = z.object({
	deliveryPersonId: z.string().uuid().optional(),
})

type ChangeDeliveryPersonBodySchema = z.infer<
	typeof changeDeliveryPersonBodySchema
>
const bodyValidationPipe = new ZodValidationPipe(changeDeliveryPersonBodySchema)

@Controller('/orders/:orderId/set-delivery-person')
export class ChangeDeliveryPersonController {
	constructor(private changeDeliveryPerson: ChangeDeliveryPersonUseCase) {}

	@Patch()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('orderId', ParseUUIDPipe) orderId: string,
		@Body(bodyValidationPipe) body: ChangeDeliveryPersonBodySchema,
	) {
		const result = await this.changeDeliveryPerson.execute({
			authPersonId: user.sub,
			deliveryPersonId: body.deliveryPersonId ?? null,
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
	}
}
