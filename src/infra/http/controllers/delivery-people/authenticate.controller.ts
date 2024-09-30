import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	Res,
	UnauthorizedException,
	UsePipes,
} from '@nestjs/common'
import { Response } from 'express'
import { z } from 'zod'

import { AuthenticateDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/authenticate'
import { InvalidCredentialsError } from '@/domain/logistic/application/use-cases/errors/invalid-credentials-error'
import { Public } from '@/infra/auth/public.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const authenticateBodySchema = z.object({
	documentNumber: z.string(),
	password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/delivery-people/session')
@Public()
export class AuthenticateDeliveryPersonController {
	constructor(
		private authenticateDeliveryPerson: AuthenticateDeliveryPersonUseCase,
	) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(
		@Body() body: AuthenticateBodySchema,
		@Res({ passthrough: true }) res: Response,
	) {
		const { documentNumber, password } = body

		const result = await this.authenticateDeliveryPerson.execute({
			documentNumber,
			password,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case InvalidCredentialsError:
					throw new UnauthorizedException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		const { accessToken } = result.value

		if (process.env.NODE_ENV === 'test') {
			res.send({
				access_token: accessToken,
			})
		} else {
			res
				.cookie('Authentication', accessToken, {
					httpOnly: true,
					secure: true,
					signed: true,
				})
				.send({
					access_token: accessToken,
				})
		}
	}
}
