import { fakerPT_BR as fakerBrazilian } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	DistributionCenter,
	DistributionCenterProps,
} from '@/domain/logistic/enterprise/entities/distribution-center'
import { PrismaDistributionCenterMapper } from '@/infra/database/prisma/mappers/prisma-distribution-center.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeDistributionCenter(
	override: Partial<DistributionCenter> = {},
	id?: UniqueEntityId,
) {
	const distributionCenter = DistributionCenter.create(
		{
			name: fakerBrazilian.person.fullName(),
			city: fakerBrazilian.location.city(),
			state: fakerBrazilian.location.state({ abbreviated: true }),
			...override,
		},
		id,
	)

	return distributionCenter
}

@Injectable()
export class DistributionCenterFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaDistributionCenter(
		data: Partial<DistributionCenterProps> = {},
	): Promise<DistributionCenter> {
		const distributionCenter = makeDistributionCenter(data)

		await this.prisma.distributionCenter.create({
			data: PrismaDistributionCenterMapper.toPrisma(distributionCenter),
		})

		return distributionCenter
	}
}
