import { DistributionCenterDetails } from '@/domain/logistic/enterprise/entities/value-objects/distribution-center-details'

export class DistributionCenterDetailsPresenter {
	static toHttp(details: DistributionCenterDetails) {
		return {
			distributionCenterId: details.distributionCenterId.toString(),
			name: details.name,
			city: details.city,
			state: details.state,
			deletedAt: details.deletedAt,
		}
	}
}
