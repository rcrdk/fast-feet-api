import { SearchOrderItem } from '@/domain/logistic/enterprise/entities/value-objects/search-order-item'

export class SearchOrderItemPresenter {
	static toHttp(details: SearchOrderItem) {
		const deliveryPerson = !details.deliveryPerson
			? null
			: {
					personId: details.deliveryPerson.personId.toString(),
					role: details.deliveryPerson.role,
					name: details.deliveryPerson.name,
					documentNumber: details.deliveryPerson.documentNumber,
					email: details.deliveryPerson.email,
					phone: details.deliveryPerson.phone,
					city: details.deliveryPerson.city,
					state: details.deliveryPerson.state,
				}

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
			deliveryPerson,
		}
	}
}
