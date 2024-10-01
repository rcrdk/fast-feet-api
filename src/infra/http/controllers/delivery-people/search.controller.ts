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

import { DeliveryPersonDetailsPresenter } from '../../presenters/delivery-person.presenter'

@Controller('/delivery-people/search')
export class SearchDeliveryPeopleAccountController {
	constructor(private searchDeliveryPeople: SearchDeliveryPeopleUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(@Query('query') query: string, @Query('limit') limit: number) {
		const result = await this.searchDeliveryPeople.execute({
			query,
			limit: Number(limit) ?? 15,
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
