import { Injectable } from '@nestjs/common'

import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'
import {
	DeliveryPersonRepository,
	FindManyByFiltersParams,
} from '@/domain/logistic/application/repositories/delivery-person.repository'
import { DeliveryPerson } from '@/domain/logistic/enterprise/entities/delivery-person'

import { PrismaDeliveryPersonMapper } from '../mappers/prisma-delivery-person.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDeliveryPersonRepository
	implements DeliveryPersonRepository
{
	constructor(private prisma: PrismaService) {}

	async findById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		})

		if (!user) {
			return null
		}

		return PrismaDeliveryPersonMapper.toDomain(user)
	}

	async findByDocumentNumber(documentNumber: string) {
		const user = await this.prisma.user.findUnique({
			where: { documentNumber },
		})

		if (!user) {
			return null
		}

		return PrismaDeliveryPersonMapper.toDomain(user)
	}

	async findByUnique(documentNumber: string, email: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				OR: [{ email }, { documentNumber }],
			},
		})

		if (!user) {
			return null
		}

		return PrismaDeliveryPersonMapper.toDomain(user)
	}

	async findManyByFilters({
		name,
		city,
		state,
		deleted,
		page,
		perPage,
	}: FindManyByFiltersParams) {
		const people = await this.prisma.user.findMany({
			where: {
				deletedAt: deleted ? { not: null } : null,
				name: name ?? undefined,
				city: city ?? undefined,
				state: state ?? undefined,
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		const countPeople = await this.prisma.user.count({
			where: {
				deletedAt: deleted ? { not: null } : null,
				name: name ?? undefined,
				city: city ?? undefined,
				state: state ?? undefined,
			},
		})

		return {
			data: people.map((item) => PrismaDeliveryPersonMapper.toDomain(item)),
			perPage,
			totalPages: Math.ceil(countPeople / perPage),
			totalItems: countPeople,
		}
	}

	async findManyBySearchQueries({ query, limit }: QueryDataLimitParams) {
		const people = await this.prisma.user.findMany({
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
					{
						documentNumber: {
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

		return people.map((item) => PrismaDeliveryPersonMapper.toDomain(item))
	}

	async create(person: DeliveryPerson) {
		const data = PrismaDeliveryPersonMapper.toPrisma(person)

		await this.prisma.user.create({
			data,
		})
	}

	async edit(person: DeliveryPerson) {
		const data = PrismaDeliveryPersonMapper.toPrisma(person)

		await this.prisma.user.update({
			where: {
				id: data.id,
			},
			data,
		})
	}

	async delete(person: DeliveryPerson) {
		person.deletePerson()

		const data = PrismaDeliveryPersonMapper.toPrisma(person)

		await this.prisma.user.update({
			where: {
				id: data.id,
			},
			data,
		})
	}

	async recover(person: DeliveryPerson) {
		person.recoverPerson()

		const data = PrismaDeliveryPersonMapper.toPrisma(person)

		await this.prisma.user.update({
			where: {
				id: data.id,
			},
			data,
		})
	}
}