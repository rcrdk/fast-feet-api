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

import { ZodValidationBooleanPipe } from '../../pipes/zod-validation-boolean.pipe'
import { ZodValidationPagePipe } from '../../pipes/zod-validation-page.pipe'
import { ZodValidationPerPagePipe } from '../../pipes/zod-validation-per-page.pipe'
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
		@Query('deleted', ZodValidationBooleanPipe) deleted: boolean,
		@Query('page', ZodValidationPagePipe) page: number,
		@Query('perPage', ZodValidationPerPagePipe) perPage: number,
	) {
		const result = await this.fetchDeliveryPeople.execute({
			name,
			city,
			state,
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
				DeliveryPersonDetailsPresenter.toHttp(item),
			),
			totalItems: result.value.totalItems,
			totalPages: result.value.totalPages,
			perPage: result.value.perPage,
		}
	}
}
