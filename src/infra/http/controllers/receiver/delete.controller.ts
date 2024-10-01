import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common'

import { DeleteReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/delete'
import { Roles } from '@/infra/auth/user-roles.decorator'

@Controller('/receivers/:receiverId')
export class DeleteReceiverController {
	constructor(private deleteReceiver: DeleteReceiverUseCase) {}

	@Delete()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(@Param('receiverId', ParseUUIDPipe) receiverId: string) {
		const result = await this.deleteReceiver.execute({
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
