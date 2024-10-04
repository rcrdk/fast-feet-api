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
import { SetOrderStatusTransferProgressUseCase } from '@/domain/logistic/application/use-cases/order-status/transfer-progress'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

const setOrderStatusBodySchema = z.object({
	deliveryPersonId: z.string().uuid(),
	nextLocationId: z.string().uuid(),
})

type SetOrderStatusBodySchema = z.infer<typeof setOrderStatusBodySchema>
const bodyValidationPipe = new ZodValidationPipe(setOrderStatusBodySchema)

@Controller('/orders/:orderId/set-status/transfer-progress')
export class SetOrderStatusTransferProgressController {
	constructor(
		private setOrderStatusTransferProgress: SetOrderStatusTransferProgressUseCase,
	) {}

	@Patch()
	@HttpCode(204)
	@Roles('ADMINISTRATOR', 'DELIVERY_PERSON')
	async handle(
		@Param('orderId', ParseUUIDPipe) orderId: string,
		@Body(bodyValidationPipe) body: SetOrderStatusBodySchema,
	) {
		const { deliveryPersonId, nextLocationId } = body

		const result = await this.setOrderStatusTransferProgress.execute({
			deliveryPersonId,
			nextLocationId,
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
