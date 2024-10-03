import { AvailableOrderItem } from '@/domain/logistic/enterprise/entities/value-objects/available-order-item'

export class AvailableOrderItemPresenter {
	static toHttp(details: AvailableOrderItem) {
		return {
			orderId: details.orderId.toString(),
			postedAt: details.postedAt,
			updatedAt: details.updatedAt,
			currentStatus: details.currentStatusCode,
			creatorName: details.creator.name,
			currentLocation: {
				currentLocationId: details.currentLocation.currentLocationId.toString(),
				name: details.currentLocation.name,
				city: details.currentLocation.city,
				state: details.currentLocation.state,
			},
			receiver: {
				receiverId: details.receiver.receiverId.toString(),
				name: details.receiver.name,
				documentNumber: details.receiver.documentNumber,
				phone: details.receiver.phone,
				email: details.receiver.email,
				address: details.receiver.address,
				city: details.receiver.city,
				state: details.receiver.state,
				neighborhood: details.receiver.neighborhood,
				zipCode: details.receiver.zipCode,
				reference: details.receiver.reference,
			},
		}
	}
}
