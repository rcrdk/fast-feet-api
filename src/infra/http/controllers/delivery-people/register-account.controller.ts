import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Post,
} from '@nestjs/common'
import { z } from 'zod'

import { RegisterDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/register'
import { UserAlreadyExistsError } from '@/domain/logistic/application/use-cases/errors/user-already-exists-error'
import { Roles } from '@/infra/auth/user-roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const createAccountBodySchema = z.object({
	name: z.string(),
	documentNumber: z.string(),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
	city: z.string(),
	state: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)

@Controller('/delivery-people')
export class RegisterDeliveryPersonAccountController {
	constructor(private registerDeliveryPerson: RegisterDeliveryPersonUseCase) {}

	@Post()
	@HttpCode(201)
	@Roles('ADMINISTRATOR')
	async handle(@Body(bodyValidationPipe) body: CreateAccountBodySchema) {
		const { name, email, password, city, state, phone, documentNumber } = body

		const result = await this.registerDeliveryPerson.execute({
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
