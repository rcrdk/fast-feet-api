/* eslint-disable prettier/prettier */
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'

import { Receiver } from '../../enterprise/entities/receiver'

export interface FindByUnique {
	documentNumber: string
	email: string
}

export abstract class ReceiverRepository {
	abstract findById(id: string): Promise<Receiver | null>
	abstract findByUnique(props: FindByUnique): Promise<Receiver | null>
	abstract findByDocumentNumber(documentNumber: string): Promise<Receiver | null>
	abstract findManyBySearchQueries(params: QueryDataLimitParams): Promise<Receiver[]>
	abstract create(data: Receiver): Promise<void>
	abstract edit(data: Receiver): Promise<void>
	abstract delete(data: Receiver): Promise<void>
	abstract recover(data: Receiver): Promise<void>
}
