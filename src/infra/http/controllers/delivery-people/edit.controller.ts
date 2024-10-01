import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Put,
} from '@nestjs/common'
import { z } from 'zod'

import { EditDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/edit'
import { UserAlreadyExistsError } from '@/domain/logistic/application/use-cases/errors/user-already-exists-error'
import { Roles } from '@/infra/auth/user-roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const editAccountBodySchema = z.object({
	name: z.string(),
	documentNumber: z.string(),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
	city: z.string(),
	state: z.string(),
})

type EditAccountBodySchema = z.infer<typeof editAccountBodySchema>
const bodyValidationPipe = new ZodValidationPipe(editAccountBodySchema)

@Controller('/delivery-people/:personId')
export class EditDeliveryPersonAccountController {
	constructor(private editDeliveryPerson: EditDeliveryPersonUseCase) {}

	@Put()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Body(bodyValidationPipe) body: EditAccountBodySchema,
		@Param('personId', ParseUUIDPipe) personId: string,
	) {
		const { name, email, password, city, state, phone, documentNumber } = body

		const result = await this.editDeliveryPerson.execute({
			personId,
			name,
			email,
			password,
			city,
			state,
			phone,
			documentNumber,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case UserAlreadyExistsError:
					throw new ConflictException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
