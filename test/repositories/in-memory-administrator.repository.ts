import { AdministratorRepository } from '@/domain/app/application/repositories/administrator.repository'
import { Administrator } from '@/domain/app/enterprise/entities/administrator'

export class InMemoryAdministratorRepository
	implements AdministratorRepository
{
	public items: Administrator[] = []

	async findByDocumentNumber(documentNumber: string) {
		const administrator = this.items.find(
			(administrator) => administrator.documentNumber === documentNumber,
		)

		return administrator ?? null
	}
}
