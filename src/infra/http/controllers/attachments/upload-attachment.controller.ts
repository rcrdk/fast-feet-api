import {
	BadRequestException,
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { UploadAndCreateAttachmentUseCase } from '@/domain/logistic/application/use-cases/attachments/upload-and-create-attachment'
import { InvalidAttachemntTypeError } from '@/domain/logistic/application/use-cases/errors/invalid-attachment-type-error'

@Controller('/attachments')
export class UploadAttachmentController {
	constructor(
		private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
	) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async handle(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 1024 * 1024 * 2, // 2MB
					}),
					new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		const result = await this.uploadAndCreateAttachment.execute({
			fileName: file.originalname,
			fileType: file.mimetype,
			body: file.buffer,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case InvalidAttachemntTypeError:
					throw new BadRequestException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		const { attachment } = result.value

		return {
			attachmentId: attachment.id.toString(),
		}
	}
}
