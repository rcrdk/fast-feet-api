import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	Attachment,
	AttachmentProps,
} from '@/domain/logistic/enterprise/entities/attachment'

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

// @Injectable()
// export class AnswerAttachmentFactory {
// 	constructor(private prisma: PrismaService) {}

// 	async makePrismaAnswerAttachment(
// 		data: Partial<AnswerAttachmentProps> = {},
// 	): Promise<AnswerAttachment> {
// 		const questionAttachment = makeAnswerAttachment(data)

// 		await this.prisma.attachment.update({
// 			where: {
// 				id: questionAttachment.attachmentId.toString(),
// 			},
// 			data: {
// 				answerId: questionAttachment.answerId.toString(),
// 			},
// 		})

// 		return questionAttachment
// 	}
// }
