import { Administrator } from '../../enterprise/entities/administrator'

export abstract class AdministratorRepository {
	abstract findByDocumentNumber(id: string): Promise<Administrator | null>
}
