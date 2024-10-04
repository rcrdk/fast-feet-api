import { Injectable } from '@nestjs/common'

import { AttachmentsRepository } from '@/domain/logistic/application/repositories/attachments.repository'
import { Attachment } from '@/domain/logistic/enterprise/entities/attachment'

import { PrismaAttachmentMapper } from '../mappers/prisma-attachment.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
	constructor(private prisma: PrismaService) {}

	async findById(id: string) {
		const attachment = await this.prisma.attachment.findUnique({
			where: { id },
		})

		if (!attachment) {
			return null
		}

		return PrismaAttachmentMapper.toDomain(attachment)
	}

	async create(attachment: Attachment) {
		const data = PrismaAttachmentMapper.toPrisma(attachment)

		await this.prisma.attachment.create({
			data,
		})
	}
}
