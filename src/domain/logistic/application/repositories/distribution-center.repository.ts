/* eslint-disable prettier/prettier */
import { PaginationData } from '@/core/repositories/pagination-data';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';

import { DistributionCenter } from '../../enterprise/entities/distribution-center'

export type FindManyByFiltersParams = PaginationParams & {
	query: string
	deleted?: boolean
}

export abstract class DistributionCenterRepository {
	abstract findById(id: string): Promise<DistributionCenter | null>
	abstract findManyByQuery(params: QueryDataLimitParams): Promise<DistributionCenter[]>
	abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<DistributionCenter[]>>
	abstract create(data: DistributionCenter): Promise<void>
	abstract edit(data: DistributionCenter): Promise<void>
	abstract delete(data: DistributionCenter): Promise<void>
	abstract recover(data: DistributionCenter): Promise<void>
}
