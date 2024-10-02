import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common'

import { SearchDistributionCentersUseCase } from '@/domain/logistic/application/use-cases/distribution-center/search'
import { InvalidQueryLengthError } from '@/domain/logistic/application/use-cases/errors/invalid-query-length-error'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationLimitPipe } from '../../pipes/zod-validation-limit.pipe'
import { ZodValidationQueryPipe } from '../../pipes/zod-validation-query.pipe'
import { DistributionCenterDetailsPresenter } from '../../presenters/distribution-center.presenter'

@Controller('/distribution-centers/search')
export class SearchDistributionCenterController {
	constructor(
		private searchDistributionCenter: SearchDistributionCentersUseCase,
	) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Query('query', ZodValidationQueryPipe) query: string,
		@Query('limit', ZodValidationLimitPipe) limit: number,
	) {
		const result = await this.searchDistributionCenter.execute({
			query,
			limit,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case InvalidQueryLengthError:
					throw new BadRequestException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		return {
			distributionCenters: result.value.distributionCenters.map((item) =>
				DistributionCenterDetailsPresenter.toHttp(item),
			),
		}
	}
}
