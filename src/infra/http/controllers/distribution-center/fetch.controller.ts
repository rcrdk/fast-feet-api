import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common'

import { FetchDistributionCenterUseCase } from '@/domain/logistic/application/use-cases/distribution-center/fetch'
import { MinQuerySearchNotProviedError } from '@/domain/logistic/application/use-cases/errors/expected-one-search-param-error'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationBooleanPipe } from '../../pipes/zod-validation-boolean.pipe'
import { ZodValidationPagePipe } from '../../pipes/zod-validation-page.pipe'
import { ZodValidationPerPagePipe } from '../../pipes/zod-validation-per-page.pipe'
import { ZodValidationQueryPipe } from '../../pipes/zod-validation-query.pipe'
import { DistributionCenterDetailsPresenter } from '../../presenters/distribution-center.presenter'

@Controller('/distribution-centers/fetch')
export class FetchDistributionCenterController {
	constructor(
		private fetchDistributionCenter: FetchDistributionCenterUseCase,
	) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Query('query', ZodValidationQueryPipe) query: string,
		@Query('deleted', ZodValidationBooleanPipe) deleted: boolean,
		@Query('page', ZodValidationPagePipe) page: number,
		@Query('perPage', ZodValidationPerPagePipe) perPage: number,
	) {
		const result = await this.fetchDistributionCenter.execute({
			query,
			deleted,
			page,
			perPage,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case MinQuerySearchNotProviedError:
					throw new BadRequestException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		return {
			data: result.value.data.map((item) =>
				DistributionCenterDetailsPresenter.toHttp(item),
			),
			totalItems: result.value.totalItems,
			totalPages: result.value.totalPages,
			perPage: result.value.perPage,
		}
	}
}
