import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Post,
	UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

import { UnauthorizedError } from '@/core/errors/unauthorized-error'
import { RegisterAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrator/register'
import { UserAlreadyExistsError } from '@/domain/logistic/application/use-cases/errors/user-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
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

@Controller('/administrators')
export class RegisterAdministratorAccountController {
	constructor(private registerAdministrator: RegisterAdministratorUseCase) {}

	@Post()
	@HttpCode(201)
	@Roles('ADMINISTRATOR')
	async handle(
		@Body(bodyValidationPipe) body: CreateAccountBodySchema,
		@CurrentUser() user: UserPayload,
	) {
		const { name, email, password, city, state, phone, documentNumber } = body

		const result = await this.registerAdministrator.execute({
			authRole: user.role,
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
				case UnauthorizedError:
					throw new UnauthorizedException(error.message)
				case UserAlreadyExistsError:
					throw new ConflictException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
