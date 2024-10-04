import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Patch,
} from '@nestjs/common'
import { z } from 'zod'

import { ChangeDeliveryPersonPasswordUseCase } from '@/domain/logistic/application/use-cases/delivery-person/change-password'
import { Roles } from '@/infra/auth/user-roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const editAccountPasswordBodySchema = z.object({
	password: z.string().min(5),
})

type EditAccountPasswordBodySchema = z.infer<
	typeof editAccountPasswordBodySchema
>
const bodyValidationPipe = new ZodValidationPipe(editAccountPasswordBodySchema)

@Controller('/delivery-people/:personId/set-password')
export class ChangeDeliveryPersonPasswordController {
	constructor(
		private changeDeliveryPersonPassword: ChangeDeliveryPersonPasswordUseCase,
	) {}

	@Patch()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(
		@Body(bodyValidationPipe) body: EditAccountPasswordBodySchema,
		@Param('personId', ParseUUIDPipe) personId: string,
	) {
		const result = await this.changeDeliveryPersonPassword.execute({
			personId,
			password: body.password,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
