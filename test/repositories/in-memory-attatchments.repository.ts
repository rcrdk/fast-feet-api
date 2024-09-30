import { AttachmentsRepository } from '@/domain/logistic/application/repositories/attachments.repository'
import { Attachment } from '@/domain/logistic/enterprise/entities/attachment'

export class InMemoryAttachementsRepository implements AttachmentsRepository {
	public items: Attachment[] = []

	async findById(id: string) {
		const attachment = this.items.find((item) => item.id.toString() === id)

		return attachment ?? null
	}

	async create(attachment: Attachment) {
		this.items.push(attachment)
	}
}
