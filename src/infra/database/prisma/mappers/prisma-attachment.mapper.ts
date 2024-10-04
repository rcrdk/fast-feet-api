import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/logistic/enterprise/entities/attachment'

export class PrismaAttachmentMapper {
	static toDomain(raw: PrismaAttachment): Attachment {
		return Attachment.create(
			{
				url: raw.url,
				orderStatusId: raw.orderStatusId
					? new UniqueEntityId(raw.orderStatusId)
					: null,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(
		attachment: Attachment,
	): Prisma.AttachmentUncheckedCreateInput {
		return {
			id: attachment.id.toString(),
			url: attachment.url,
			orderStatusId: attachment.orderStatusId?.toString(),
		}
	}
}
