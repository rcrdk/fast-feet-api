import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
	ParseUUIDPipe,
} from '@nestjs/common'

import { DeleteOrderUseCase } from '@/domain/logistic/application/use-cases/order/delete'
import { Roles } from '@/infra/auth/user-roles.decorator'

@Controller('/orders/:orderId')
export class DeleteOrderController {
	constructor(private deleteOrder: DeleteOrderUseCase) {}

	@Delete()
	@HttpCode(204)
	@Roles('ADMINISTRATOR')
	async handle(@Param('orderId', ParseUUIDPipe) orderId: string) {
		const result = await this.deleteOrder.execute({
			orderId,
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
