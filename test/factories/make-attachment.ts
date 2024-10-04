import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	Attachment,
	AttachmentProps,
} from '@/domain/logistic/enterprise/entities/attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeAttachment(
	override: Partial<AttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const attachment = Attachment.create(
		{
			url: faker.internet.url(),
			...override,
		},
		id,
	)

	return attachment
}

@Injectable()
export class AttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAttachment(
		data: Partial<AttachmentProps> = {},
	): Promise<Attachment> {
		const attachment = makeAttachment(data)

		await this.prisma.attachment.create({
			data: {
				id: attachment.id.toString(),
				url: attachment.url,
			},
		})

		return attachment
	}
}
