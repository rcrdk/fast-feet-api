import { InMemoryAttachementsRepository } from 'test/repositories/in-memory-attatchments.repository'
import { FakeUploader } from 'test/storage/fake-uploader'

import { InvalidAttachemntTypeError } from '../errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachementsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachementsRepository()
		fakeUploader = new FakeUploader()
		sut = new UploadAndCreateAttachmentUseCase(
			inMemoryAttachmentsRepository,
			fakeUploader,
		)
	})

	it('should be able to upload and create an attachment', async () => {
		const result = await sut.execute({
			fileName: 'profile.png',
			fileType: 'image/png',
			body: Buffer.from(''),
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentsRepository.items.at(0),
		})

		expect(fakeUploader.uploads).toHaveLength(1)
		expect(fakeUploader.uploads.at(0)).toEqual(
			expect.objectContaining({ fileName: 'profile.png' }),
		)
	})

	it('should not be able to upload and create an attachment with wrong types', async () => {
		const result = await sut.execute({
			fileName: 'profile.webp',
			fileType: 'image/webp',
			body: Buffer.from(''),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidAttachemntTypeError)
	})
})
