import { randomUUID } from 'node:crypto'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

import {
	Uploader,
	UploadParams,
} from '@/domain/app/application/storage/uploader'

import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
	private client: S3Client

	constructor(private envService: EnvService) {
		const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')

		this.client = new S3Client({
			endpoint: `https://${accountId}.r2.cloudflarestorage.com/`,
			region: 'auto',
			credentials: {
				accessKeyId: envService.get('AWS_ACCESS_KEY'),
				secretAccessKey: envService.get('AWS_SECRET_KEY'),
			},
		})
	}

	async upload({ fileName, fileType, body }: UploadParams) {
		const uploadid = randomUUID()
		const uniqueFileName = `${uploadid}-${fileName}`

		await this.client.send(
			new PutObjectCommand({
				Bucket: this.envService.get('AWS_BUCKET'),
				Key: uniqueFileName,
				ContentType: fileType,
				Body: body,
			}),
		)

		return {
			url: uniqueFileName,
		}
	}
}
