import { Injectable } from '@nestjs/common'

import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'
import {
	DistributionCenterRepository,
	FindManyByFiltersParams,
} from '@/domain/logistic/application/repositories/distribution-center.repository'
import { DistributionCenter } from '@/domain/logistic/enterprise/entities/distribution-center'

import { PrismaDistributionCenterMapper } from '../mappers/prisma-distribution-center.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDistributionCenterRepository
	implements DistributionCenterRepository
{
	constructor(private prisma: PrismaService) {}

	async findById(id: string) {
		const distributionCenter = await this.prisma.distributionCenter.findUnique({
			where: {
				id,
			},
		})

		if (!distributionCenter) {
			return null
		}

		return PrismaDistributionCenterMapper.toDomain(distributionCenter)
	}

	async findManyByQuery({ limit, query }: QueryDataLimitParams) {
		const people = await this.prisma.distributionCenter.findMany({
			where: {
				OR: [
					{
						name: {
							contains: query,
							mode: 'insensitive',
						},
					},
					{
						city: {
							contains: query,
							mode: 'insensitive',
						},
					},
					{
						state: {
							contains: query,
							mode: 'insensitive',
						},
					},
				],
				AND: {
					deletedAt: null,
				},
			},
			take: limit,
		})

		return people.map((item) => {
			return PrismaDistributionCenterMapper.toDomain(item)
		})
	}

	async findManyByFilters({
		query,
		deleted,
		page,
		perPage,
	}: FindManyByFiltersParams) {
		const people = await this.prisma.distributionCenter.findMany({
			where: {
				OR: [
					{
						name: {
							contains: query,
							mode: 'insensitive',
						},
					},
					{
						city: {
							contains: query,
							mode: 'insensitive',
						},
					},
					{
						state: {
							contains: query,
							mode: 'insensitive',
						},
					},
				],
				AND: {
					deletedAt: deleted ? { not: null } : null,
				},
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		const countPeople = await this.prisma.distributionCenter.count({
			where: {
				OR: [
					{
						name: {
							contains: query,
							mode: 'insensitive',
						},
					},
					{
						city: {
							contains: query,
							mode: 'insensitive',
						},
					},
					{
						state: {
							contains: query,
							mode: 'insensitive',
						},
					},
				],
				AND: {
					deletedAt: deleted ? { not: null } : null,
				},
			},
		})

		return {
			data: people.map((item) => {
				return PrismaDistributionCenterMapper.toDomain(item)
			}),
			perPage,
			totalPages: Math.ceil(countPeople / perPage),
			totalItems: countPeople,
		}
	}

	async create(dc: DistributionCenter) {
		const data = PrismaDistributionCenterMapper.toPrisma(dc)

		await this.prisma.distributionCenter.create({
			data,
		})
	}

	async edit(dc: DistributionCenter) {
		const data = PrismaDistributionCenterMapper.toPrisma(dc)

		await this.prisma.distributionCenter.update({
			where: {
				id: data.id,
			},
			data,
		})
	}

	async delete(dc: DistributionCenter) {
		dc.deleteDistributionCenter()

		const data = PrismaDistributionCenterMapper.toPrisma(dc)

		await this.prisma.distributionCenter.update({
			where: {
				id: data.id,
			},
			data,
		})
	}

	async recover(dc: DistributionCenter) {
		dc.recoverDistributionCenter()

		const data = PrismaDistributionCenterMapper.toPrisma(dc)

		await this.prisma.distributionCenter.update({
			where: {
				id: data.id,
			},
			data,
		})
	}
}
