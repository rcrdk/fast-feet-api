import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'

import { CreateOrderUseCase } from '@/domain/logistic/application/use-cases/order/create'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/user-roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const createOrderBodySchema = z.object({
	deliveryPersonId: z.string().uuid().optional(),
	receiverId: z.string().uuid(),
	originDistributionCenterId: z.string().uuid(),
})

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>
const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

@Controller('/orders')
export class CreateOrderController {
	constructor(private createOrder: CreateOrderUseCase) {}

	@Post()
	@HttpCode(201)
	@Roles('ADMINISTRATOR')
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: CreateOrderBodySchema,
	) {
		const { originDistributionCenterId, receiverId, deliveryPersonId } = body

		await this.createOrder.execute({
			creatorId: user.sub,
			deliveryPersonId,
			receiverId,
			originDistributionCenterId,
		})
	}
}
