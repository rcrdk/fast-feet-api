import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common'

import { InvalidQueryLengthError } from '@/domain/logistic/application/use-cases/errors/invalid-query-length-error'
import { SearchReceiversUseCase } from '@/domain/logistic/application/use-cases/receiver/search'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationLimitPipe } from '../../pipes/zod-validation-limit.pipe'
import { ZodValidationQueryPipe } from '../../pipes/zod-validation-query.pipe'
import { ReceiverDetailsPresenter } from '../../presenters/receiver.presenter'

@Controller('/receivers/search')
export class SearchReceiversController {
	constructor(private searchReceivers: SearchReceiversUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Query('query', ZodValidationQueryPipe) query: string,
		@Query('limit', ZodValidationLimitPipe) limit: number,
	) {
		const result = await this.searchReceivers.execute({
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
			receivers: result.value.receivers.map((item) =>
				ReceiverDetailsPresenter.toHttp(item),
			),
		}
	}
}
