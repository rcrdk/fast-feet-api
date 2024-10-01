import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Query,
} from '@nestjs/common'

import { FetchDeliveryPeopleUseCase } from '@/domain/logistic/application/use-cases/delivery-person/fetch'
import { MinQuerySearchNotProviedError } from '@/domain/logistic/application/use-cases/errors/expected-one-search-param-error'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { DeliveryPersonDetailsPresenter } from '../../presenters/delivery-person.presenter'

@Controller('/delivery-people/fetch')
export class FetchDeliveryPeopleAccountController {
	constructor(private fetchDeliveryPeople: FetchDeliveryPeopleUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(
		@Query('name') name: string,
		@Query('city') city: string,
		@Query('state') state: string,
		@Query('deleted') deleted: string,
		@Query('page') page: number,
		@Query('perPage') perPage: number,
	) {
		const result = await this.fetchDeliveryPeople.execute({
			name,
			city,
			state,
			deleted: deleted === 'true',
			page: Number(page) ?? 1,
			perPage: Number(perPage) ?? 20,
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
				DeliveryPersonDetailsPresenter.toHttp(item),
			),
			totalItems: result.value.totalItems,
			totalPages: result.value.totalPages,
			perPage: result.value.perPage,
		}
	}
}
