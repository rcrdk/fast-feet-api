import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Put,
} from '@nestjs/common'
import { z } from 'zod'

import { EditReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/edit'
import { Roles } from '@/infra/auth/user-roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const editReceiverBodySchema = z.object({
	name: z.string(),
	documentNumber: z.string(),
	phone: z.string(),
	email: z.string(),
	address: z.string(),
	city: z.string(),
	state: z.string(),
	neighborhood: z.string(),
	zipCode: z.string(),
	reference: z.string().optional(),
})

type EditReceiverBodySchema = z.infer<typeof editReceiverBodySchema>
const bodyValidationPipe = new ZodValidationPipe(editReceiverBodySchema)

@Controller('/receivers/:receiverId')
export class EditReceiverController {
	constructor(private editReceiver: EditReceiverUseCase) {}

	@Put()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Body(bodyValidationPipe) body: EditReceiverBodySchema,
		@Param('receiverId', ParseUUIDPipe) receiverId: string,
	) {
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
			reference,
		} = body

		const result = await this.editReceiver.execute({
			personId: receiverId,
			name,
			documentNumber,
			phone,
			email,
			address,
			city,
			state,
			neighborhood,
			zipCode,
			reference,
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
