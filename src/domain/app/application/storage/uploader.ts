export interface UploadParams {
	fileName: string
	fileType: string
	body: Buffer
}

export interface UploadBody {
	url: string
}

export abstract class Uploader {
	abstract upload(params: UploadParams): Promise<UploadBody>
}
