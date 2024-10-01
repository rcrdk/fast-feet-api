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

import { EditDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/edit'
import { Roles } from '@/infra/auth/user-roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const editDistributionCenterBodySchema = z.object({
	name: z.string(),
	city: z.string(),
	state: z.string(),
})

type EditDistributionCenterBodySchema = z.infer<
	typeof editDistributionCenterBodySchema
>
const bodyValidationPipe = new ZodValidationPipe(
	editDistributionCenterBodySchema,
)

@Controller('/distribution-centers/:distributionCenterId')
export class EditDistributionCenterController {
	constructor(private editDistributionCenter: EditDistributionCenterUseCase) {}

	@Put()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Body(bodyValidationPipe) body: EditDistributionCenterBodySchema,
		@Param('distributionCenterId', ParseUUIDPipe) distributionCenterId: string,
	) {
		const { name, city, state } = body

		const result = await this.editDistributionCenter.execute({
			distributionCenterId,
			name,
			city,
			state,
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
