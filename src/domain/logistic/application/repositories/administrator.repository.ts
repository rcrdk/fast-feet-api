/* eslint-disable prettier/prettier */
import { Administrator } from '../../enterprise/entities/administrator'

export abstract class AdministratorRepository {
	abstract findByDocumentNumber(id: string): Promise<Administrator | null>
	abstract findByUnique(documentNumber: string, email: string): Promise<Administrator | null>
	abstract create(data: Administrator): Promise<void>
}
