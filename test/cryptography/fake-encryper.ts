import { Encrypter } from '@/domain/app/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
	async encrypt(payload: Record<string, unknown>) {
		return JSON.stringify(payload)
	}
}
