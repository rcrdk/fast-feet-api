import { Injectable } from '@nestjs/common'

import { AdministratorRepository } from '@/domain/logistic/application/repositories/administrator.repository'
import { Administrator } from '@/domain/logistic/enterprise/entities/administrator'

import { PrismaAdministratorMapper } from '../mappers/prisma-administrator.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdministratorRepository implements AdministratorRepository {
	constructor(private prisma: PrismaService) {}

	async findByDocumentNumber(documentNumber: string) {
		const user = await this.prisma.user.findUnique({
			where: { documentNumber },
		})

		if (!user) {
			return null
		}

		return PrismaAdministratorMapper.toDomain(user)
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

		return PrismaAdministratorMapper.toDomain(user)
	}

	async create(administrator: Administrator) {
		const data = PrismaAdministratorMapper.toPrisma(administrator)

		await this.prisma.user.create({
			data,
		})
	}
}
