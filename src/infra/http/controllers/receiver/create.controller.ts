import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'

import { CreateReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/create'
import { Roles } from '@/infra/auth/user-roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const createReceiverBodySchema = z.object({
	name: z.string(),
	documentNumber: z.string(),
	phone: z.string(),
	email: z.string(),
	address: z.string(),
	city: z.string(),
	state: z.string(),
	neighborhood: z.string(),
	zipCode: z.string(),
})

type CreateReceiverBodySchema = z.infer<typeof createReceiverBodySchema>
const bodyValidationPipe = new ZodValidationPipe(createReceiverBodySchema)

@Controller('/receivers')
export class CreateReceiverController {
	constructor(private createReceiver: CreateReceiverUseCase) {}

	@Post()
	@HttpCode(201)
	@Roles('ADMINISTRATOR')
	async handle(@Body(bodyValidationPipe) body: CreateReceiverBodySchema) {
		const {
			name,
			documentNumber,
			phone,
			email,
			address,
			city,
			state,
			neighborhood,
			zipCode,
		} = body

		await this.createReceiver.execute({
			name,
			documentNumber,
			phone,
			email,
			address,
			city,
			state,
			neighborhood,
			zipCode,
		})
	}
}
