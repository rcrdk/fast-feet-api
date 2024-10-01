import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Patch,
} from '@nestjs/common'

import { RecoverReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/recover'
import { Roles } from '@/infra/auth/user-roles.decorator'

@Controller('/receivers/:receiverId/recover')
export class RecoverReceiverController {
	constructor(private recoverReceiver: RecoverReceiverUseCase) {}

	@Patch()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(@Param('receiverId', ParseUUIDPipe) receiverId: string) {
		const result = await this.recoverReceiver.execute({
			personId: receiverId,
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
