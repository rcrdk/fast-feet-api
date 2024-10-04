/* eslint-disable prettier/prettier */
import { OrderDetails } from '@/domain/logistic/enterprise/entities/value-objects/order-details'

export class OrderDetailsPresenter {
	static toHttp(details: OrderDetails) {
		const deliveryPerson = !details.deliveryPerson ? null : {
			personId: details.deliveryPerson.personId.toString(),
			role: details.deliveryPerson.role,
			name: details.deliveryPerson.name,
			documentNumber: details.deliveryPerson.documentNumber,
			email: details.deliveryPerson.email,
			phone: details.deliveryPerson.phone,
			city: details.deliveryPerson.city,
			state: details.deliveryPerson.state,
		}

		const status = details.orderStatus.map((item) => {
			return {
				statusCode: item.statusCode,
				details: item.details ?? null,
				updatedAt: item.updatedAt,
				creatorName: item.creator.name,
				attachment: item.attachments.length > 0 ? {
					orderStatusId: item.attachments.at(0)?.orderStatusId ? item.attachments.at(0)!	.orderStatusId!.toString() : null,
					attachmentId: item.attachments.at(0)!.attachmentId.toString(),
					url: item.attachments.at(0)!.url,
				} : null,
				currentLocation: item.currentLocation ? {
					currentLocationId: item.currentLocation.currentLocationId.toString(),
					name: item.currentLocation.name,
					city: item.currentLocation.city,
					state: item.currentLocation.state,
				} : null
			}
		})

		return {
			orderId: details.orderId.toString(),
			postedAt: details.postedAt,
			updatedAt: details.updatedAt,
			currentStatus: details.currentStatusCode,
			creatorName: details.creator.name,
			originLocation: {
				originLocationId: details.originLocation.originLocationId.toString(),
				name: details.originLocation.name,
				city: details.originLocation.city,
				state: details.originLocation.state,
			},
			deliveryPerson,
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
			status,
		}
	}
}
