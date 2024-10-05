import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	Patch,
} from '@nestjs/common'

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/user-roles.decorator'

import { NotificationPresenter } from '../../presenters/notification.presenter'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
	constructor(private readNotification: ReadNotificationUseCase) {}

	@Patch()
	@HttpCode(200)
	@Roles('ADMINISTRATOR', 'DELIVERY_PERSON')
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('notificationId') notificationId: string,
	) {
		const result = await this.readNotification.execute({
			notificationId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}

		return {
			notification: NotificationPresenter.toHttp(result.value.notification),
		}
	}
}
