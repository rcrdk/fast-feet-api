import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common'

import { ViewReceiverUseCase } from '@/domain/logistic/application/use-cases/receiver/view'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { ReceiverDetailsPresenter } from '../../presenters/receiver.presenter'

@Controller('/receivers/view/:receiverId')
export class ViewReceiverController {
	constructor(private viewReceiver: ViewReceiverUseCase) {}

	@Get()
	@HttpCode(200)
	@Roles('ADMINISTRATOR')
	async handle(@Param('receiverId', ParseUUIDPipe) receiverId: string) {
		const result = await this.viewReceiver.execute({
			personId: receiverId,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				default:
					throw new BadRequestException(error.message)
			}
		}

		return {
			receiver: ReceiverDetailsPresenter.toHttp(result.value.receiver),
		}
	}
}
