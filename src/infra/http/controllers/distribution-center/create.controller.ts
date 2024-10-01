import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'

import { CreateDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/create'
import { Roles } from '@/infra/auth/user-roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const createDistributionCenterBodySchema = z.object({
	name: z.string(),
	city: z.string(),
	state: z.string(),
})

type CreateDistributionCenterBodySchema = z.infer<
	typeof createDistributionCenterBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(
	createDistributionCenterBodySchema,
)

@Controller('/distribution-centers')
export class CreateDistributionCenterController {
	constructor(
		private createDistributionCenter: CreateDistributionCenterUseCase,
	) {}

	@Post()
	@HttpCode(201)
	@Roles('ADMINISTRATOR')
	async handle(
		@Body(bodyValidationPipe) body: CreateDistributionCenterBodySchema,
	) {
		const { name, city, state } = body

		await this.createDistributionCenter.execute({
			name,
			city,
			state,
		})
	}
}
