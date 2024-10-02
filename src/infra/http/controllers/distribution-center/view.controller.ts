import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common'

import { ViewDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/view'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { DistributionCenterDetailsPresenter } from '../../presenters/distribution-center.presenter'

@Controller('/distribution-centers/view/:distributionCenterId')
export class ViewDistributionCenterController {
	constructor(private viewDistributionCenter: ViewDistributionCenterUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Param('distributionCenterId', ParseUUIDPipe) distributionCenterId: string,
	) {
		const result = await this.viewDistributionCenter.execute({
			distributionCenterId,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				default:
					throw new BadRequestException(error.message)
			}
		}

		return {
			// eslint-disable-next-line prettier/prettier
			distributionCenter: DistributionCenterDetailsPresenter.toHttp(result.value.distributionCenter),
		}
	}
}
