import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Patch,
} from '@nestjs/common'

import { RecoverDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/recover'
import { Roles } from '@/infra/auth/user-roles.decorator'

@Controller('/distribution-centers/:distributionCenterId/recover')
export class RecoverDistributionCenterController {
	constructor(
		private recoverDistributionCenter: RecoverDistributionCenterUseCase,
	) {}

	@Patch()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(
		@Param('distributionCenterId', ParseUUIDPipe) distributionCenterId: string,
	) {
		const result = await this.recoverDistributionCenter.execute({
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
