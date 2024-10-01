import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common'

import { DeleteDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/delete'
import { Roles } from '@/infra/auth/user-roles.decorator'

@Controller('/distribution-centers/:distributionCenterId')
export class DeleteDistributionCenterController {
	constructor(
		private deleteDistributionCenter: DeleteDistributionCenterUseCase,
	) {}

	@Delete()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(
		@Param('distributionCenterId', ParseUUIDPipe) distributionCenterId: string,
	) {
		const result = await this.deleteDistributionCenter.execute({
			distributionCenterId,
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
