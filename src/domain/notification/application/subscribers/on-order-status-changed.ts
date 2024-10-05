import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderStatusCode } from '@/core/repositories/statuses'
import { OrderRepository } from '@/domain/logistic/application/repositories/order.repository'
import { OrderStatusChangedEvent } from '@/domain/logistic/enterprise/events/order-status-changed-event'

import { SendNotificationUseCase } from '../use-cases/send-notification'

@Injectable()
export class OnOrderStatusChanged implements EventHandler {
	constructor(
		private orderRepository: OrderRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions()
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendOrderChangeNotification.bind(this),
			OrderStatusChangedEvent.name,
		)
	}

	private async sendOrderChangeNotification({
		order: o,
	}: OrderStatusChangedEvent) {
		const order = await this.orderRepository.findByIdWithDetails(
			o.id.toString(),
		)

		if (order) {
			function getStatusDetailsText(status: OrderStatusCode) {
				return (
					// eslint-disable-next-line prettier/prettier
					order!.orderStatus.reverse().find((item) => item.statusCode === status)?.details ?? 'Not informed'
				)
			}

			function renderContent(status: OrderStatusCode) {
				const originLocationName = order?.originLocation.name ?? ''
				const originLocationCity = order?.originLocation.city ?? ''
				const originLocationState = order?.originLocation.state ?? ''
				const currentLocationName = order?.currentLocation?.name ?? ''
				const currentLocationCity = order?.currentLocation?.city ?? ''
				const currentLocationState = order?.currentLocation?.state ?? ''
				const deliveryPerson = order?.deliveryPerson?.name ?? ''

				switch (status) {
					case 'POSTED':
						return `Your order was posted at ${originLocationName} at ${originLocationCity}/${originLocationState} and is awaiting for a delivery person to pick it up.`
					case 'PICKED':
						return `Your order was picked by ${deliveryPerson} on ${originLocationName} at ${originLocationCity}/${originLocationState} and soon it will be in transportation.`
					case 'TRANSFER_PROGRESS':
						return `Your order is being transported to ${currentLocationName} at ${currentLocationCity}/${currentLocationState} by ${deliveryPerson}.`
					case 'AWAITING_PICK_UP':
						return `Your order is awaiting for another delivery person to pick it up at ${currentLocationName ?? ''} in ${currentLocationCity}/${currentLocationState}.`
					case 'TRANSFER_FINISHED':
						return `Your order arrived at ${currentLocationName ?? ''} in ${currentLocationCity}/${currentLocationState}.`
					case 'ON_ROUTE':
						return `Your order is on route for deliver. Reason: ${getStatusDetailsText('ON_ROUTE')}`
					case 'DELIVERED':
						return `Your order was delivered. Reason: ${getStatusDetailsText('DELIVERED')}`
					case 'CANCELED':
						return `Your order was canceled. Reason: ${getStatusDetailsText('CANCELED')}`
					case 'RETURNED':
						return `Your order was returned. Reason: ${getStatusDetailsText('RETURNED')}`
				}
			}

			await this.sendNotification.execute({
				recipientId: order.receiver.receiverId.toString(),
				title: `Order ${order.orderId.toString()} status has been updated`,
				content: renderContent(order.currentStatusCode),
			})
		}
	}
}
