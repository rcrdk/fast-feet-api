import { DeliveryPersonDetails } from '@/domain/logistic/enterprise/entities/value-objects/delivery-person-details'

export class DeliveryPersonDetailsPresenter {
	static toHttp(details: DeliveryPersonDetails) {
		return {
			personId: details.personId.toString(),
			role: details.role,
			name: details.name,
			documentNumber: details.documentNumber,
			email: details.email,
			phone: details.phone,
			city: details.city,
			state: details.state,
			detetedAt: details.deletedAt,
		}
	}
}
