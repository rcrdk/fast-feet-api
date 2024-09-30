import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Attachment } from '@/domain/logistic/enterprise/entities/attachment'

import { AttachmentsRepository } from '../../repositories/attachments.repository'
import { Uploader } from '../../storage/uploader'
import { InvalidAttachemntTypeError } from '../errors/invalid-attachment-type-error'

interface UploadAndCreateAttachmentUseCaseRequest {
	fileName: string
	fileType: string
	body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
	InvalidAttachemntTypeError,
	{
		attachment: Attachment
	}
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
	constructor(
		private attachmentsRepository: AttachmentsRepository,
		private uploader: Uploader,
	) {}

	async execute({
		fileName,
		fileType,
		body,
	}: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
		if (!/^image\/(jpeg|png)$|^application\/pdf$/.test(fileType)) {
			return left(new InvalidAttachemntTypeError(fileType))
		}

		const { url } = await this.uploader.upload({ fileName, fileType, body })

		const attachment = Attachment.create({
			url,
		})

		await this.attachmentsRepository.create(attachment)

		return right({ attachment })
	}
}
