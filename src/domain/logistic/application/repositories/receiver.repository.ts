/* eslint-disable prettier/prettier */
import { PaginationData } from '@/core/repositories/pagination-data'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'

import { Receiver } from '../../enterprise/entities/receiver'
import { ReceiverDetails } from '../../enterprise/entities/value-objects/receiver-details'

export interface FindByUnique {
	documentNumber: string
	email: string
}

export type FindManyByFiltersParams = PaginationParams & {
	query: string
	deleted?: boolean
}

export abstract class ReceiverRepository {
	abstract findById(id: string): Promise<Receiver | null>
	abstract findByIdWithDetails(id: string): Promise<ReceiverDetails | null>
	abstract findByUnique(props: FindByUnique): Promise<Receiver | null>
	abstract findByDocumentNumber(documentNumber: string): Promise<Receiver | null>
	abstract findManyBySearchQueries(params: QueryDataLimitParams): Promise<Receiver[]>
	abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<Receiver[]>>
	abstract create(data: Receiver): Promise<void>
	abstract edit(data: Receiver): Promise<void>
	abstract delete(data: Receiver): Promise<void>
	abstract recover(data: Receiver): Promise<void>
}
