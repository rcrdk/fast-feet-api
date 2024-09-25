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

	async findByUnique(documentNumber: string, email: string) {
		const person = this.items.find((person) => {
			return person.documentNumber === documentNumber || person.email === email
		})

		return person ?? null
	}

	async create(data: Administrator) {
		this.items.push(data)
	}
}
