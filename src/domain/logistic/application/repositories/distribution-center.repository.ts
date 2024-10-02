/* eslint-disable prettier/prettier */
import { PaginationData } from '@/core/repositories/pagination-data';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';

import { DistributionCenter } from '../../enterprise/entities/distribution-center'
import { DistributionCenterDetails } from '../../enterprise/entities/value-objects/distribution-center-details';

export type FindManyByFiltersParams = PaginationParams & {
	query: string
	deleted?: boolean
}

export abstract class DistributionCenterRepository {
	abstract findById(id: string): Promise<DistributionCenter | null>
	abstract findByIdWithDetails(id: string): Promise<DistributionCenterDetails | null>
	abstract findManyByQuery(params: QueryDataLimitParams): Promise<DistributionCenterDetails[]>
	abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<DistributionCenterDetails[]>>
	abstract create(data: DistributionCenter): Promise<void>
	abstract edit(data: DistributionCenter): Promise<void>
	abstract delete(data: DistributionCenter): Promise<void>
	abstract recover(data: DistributionCenter): Promise<void>
}
