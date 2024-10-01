import { DistributionCenter as PrismaDC, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DistributionCenter } from '@/domain/logistic/enterprise/entities/distribution-center'

export class PrismaDistributionCenterMapper {
	static toDomain(raw: PrismaDC): DistributionCenter {
		return DistributionCenter.create(
			{
				name: raw.name,
				city: raw.city,
				state: raw.state,
				deletedAt: raw.deletedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(
		dc: DistributionCenter,
	): Prisma.DistributionCenterUncheckedCreateInput {
		return {
			id: dc.id.toString(),
			name: dc.name,
			city: dc.city,
			state: dc.state,
			deletedAt: dc.deletedAt,
		}
	}
}
