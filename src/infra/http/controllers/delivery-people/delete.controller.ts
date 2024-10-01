import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common'

import { DeleteDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/delete'
import { Roles } from '@/infra/auth/user-roles.decorator'

@Controller('/delivery-people/:personId')
export class DeleteDeliveryPersonAccountController {
	constructor(private deleteDeliveryPerson: DeleteDeliveryPersonUseCase) {}

	@Delete()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(@Param('personId', ParseUUIDPipe) personId: string) {
		const result = await this.deleteDeliveryPerson.execute({
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
