import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common'

import { ViewDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/view'
import { Roles } from '@/infra/auth/user-roles.decorator'

@Controller('/delivery-people/:personId')
export class ViewDeliveryPersonAccountController {
	constructor(private viewDeliveryPerson: ViewDeliveryPersonUseCase) {}

	@Get()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(@Param('personId', ParseUUIDPipe) personId: string) {
		const result = await this.viewDeliveryPerson.execute({
			personId,
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
