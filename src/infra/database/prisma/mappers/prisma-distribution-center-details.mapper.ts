import { DistributionCenter as PrismaDC } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DistributionCenterDetails } from '@/domain/logistic/enterprise/entities/value-objects/distribution-center-details'

export class PrismaDistributionCenterDetailsMapper {
	static toDomain(raw: PrismaDC): DistributionCenterDetails {
		return DistributionCenterDetails.create({
			distributionCenterId: new UniqueEntityId(raw.id),
			name: raw.name,
			city: raw.city,
			state: raw.state,
			deletedAt: raw.deletedAt,
		})
	}
}
