import { Injectable } from '@nestjs/common'

import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'
import {
	FindByUnique,
	FindManyByFiltersParams,
	ReceiverRepository,
} from '@/domain/logistic/application/repositories/receiver.repository'
import { Receiver } from '@/domain/logistic/enterprise/entities/receiver'

import { PrismaReceiverMapper } from '../mappers/prisma-receiver.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaReceiverRepository implements ReceiverRepository {
	constructor(private prisma: PrismaService) {}

	async findById(id: string) {
		const receiver = await this.prisma.receiver.findUnique({
			where: {
				id,
			},
		})

		if (!receiver) {
			return null
		}

		return PrismaReceiverMapper.toDomain(receiver)
	}

	async findByUnique({ documentNumber, email }: FindByUnique) {
		const receiver = await this.prisma.receiver.findFirst({
			where: {
				OR: [{ email }, { documentNumber }],
			},
		})

		if (!receiver) {
			return null
		}

		return PrismaReceiverMapper.toDomain(receiver)
	}

	async findByDocumentNumber(documentNumber: string) {
		const receiver = await this.prisma.receiver.findUnique({
			where: {
				documentNumber,
			},
		})

		if (!receiver) {
			return null
		}

		return PrismaReceiverMapper.toDomain(receiver)
	}

	async findManyBySearchQueries({ query, limit }: QueryDataLimitParams) {
		const receivers = await this.prisma.receiver.findMany({
			where: {
				OR: [
					{
						name: {
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

		return receivers.map((item) => {
			return PrismaReceiverMapper.toDomain(item)
		})
	}

	async findManyByFilters({
		query,
		deleted,
		page,
		perPage,
	}: FindManyByFiltersParams) {
		const receivers = await this.prisma.receiver.findMany({
			where: {
				OR: [
					{
						name: {
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
					deletedAt: deleted ? { not: null } : null,
				},
			},
			take: perPage,
			skip: (page - 1) * perPage,
		})

		const countReceivers = await this.prisma.receiver.count({
			where: {
				OR: [
					{
						name: {
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
					deletedAt: deleted ? { not: null } : null,
				},
			},
		})

		return {
			data: receivers.map((item) => {
				return PrismaReceiverMapper.toDomain(item)
			}),
			perPage,
			totalPages: Math.ceil(countReceivers / perPage),
			totalItems: countReceivers,
		}
	}

	async create(receiver: Receiver) {
		const data = PrismaReceiverMapper.toPrisma(receiver)

		await this.prisma.receiver.create({
			data,
		})
	}

	async edit(receiver: Receiver) {
		const data = PrismaReceiverMapper.toPrisma(receiver)

		await this.prisma.receiver.update({
			where: {
				id: data.id,
			},
			data,
		})
	}

	async delete(receiver: Receiver) {
		receiver.deleteReceiver()

		const data = PrismaReceiverMapper.toPrisma(receiver)

		await this.prisma.receiver.update({
			where: {
				id: data.id,
			},
			data,
		})
	}

	async recover(receiver: Receiver) {
		receiver.recoverReceiver()

		const data = PrismaReceiverMapper.toPrisma(receiver)

		await this.prisma.receiver.update({
			where: {
				id: data.id,
			},
			data,
		})
	}
}
