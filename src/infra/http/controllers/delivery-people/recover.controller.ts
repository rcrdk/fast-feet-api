import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Patch,
} from '@nestjs/common'

import { RecoverDeliveryPersonUseCase } from '@/domain/logistic/application/use-cases/delivery-person/recover'
import { Roles } from '@/infra/auth/user-roles.decorator'

@Controller('/delivery-people/:personId/recover')
export class RecoverDeliveryPersonAccountController {
	constructor(private recoverDeliveryPerson: RecoverDeliveryPersonUseCase) {}

	@Patch()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(@Param('personId', ParseUUIDPipe) personId: string) {
		const result = await this.recoverDeliveryPerson.execute({
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
