import { ReceiverDetails } from '@/domain/logistic/enterprise/entities/value-objects/receiver-details'

export class DeliveryPersonDetailsPresenter {
	static toHttp(details: ReceiverDetails) {
		return {
			receiverId: details.receiverId.toString(),
			name: details.name,
			documentNumber: details.documentNumber,
			phone: details.phone,
			email: details.email,
			address: details.address,
			city: details.city,
			state: details.state,
			neighborhood: details.neighborhood,
			zipCode: details.zipCode,
			reference: details.reference,
			deletedAt: details.deletedAt,
		}
	}
}
