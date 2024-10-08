import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common'

import { SearchDeliveryPeopleUseCase } from '@/domain/logistic/application/use-cases/delivery-person/search'
import { InvalidQueryLengthError } from '@/domain/logistic/application/use-cases/errors/invalid-query-length-error'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ZodValidationLimitPipe } from '../../pipes/zod-validation-limit.pipe'
import { ZodValidationQueryPipe } from '../../pipes/zod-validation-query.pipe'
import { DeliveryPersonDetailsPresenter } from '../../presenters/delivery-person.presenter'

@Controller('/delivery-people/search')
export class SearchDeliveryPeopleAccountController {
	constructor(private searchDeliveryPeople: SearchDeliveryPeopleUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Query('query', ZodValidationQueryPipe) query: string,
		@Query('limit', ZodValidationLimitPipe) limit: number,
	) {
		const result = await this.searchDeliveryPeople.execute({
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
			deliveryPeople: result.value.deliveryPeople.map((item) =>
				DeliveryPersonDetailsPresenter.toHttp(item),
			),
		}
	}
}
