/* eslint-disable prettier/prettier */
import { PaginationData } from "@/core/repositories/pagination-data";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QueryDataLimitParams } from "@/core/repositories/query-data-limit";

import { DeliveryPerson } from "../../enterprise/entities/delivery-person";
import { DeliveryPersonDetails } from "../../enterprise/entities/value-objects/delivery-person-details";

export type FindManyByFiltersParams = PaginationParams & {
	name?: string
	city?: string
	state?: string
	deleted?: boolean
}

export abstract class DeliveryPersonRepository {
	abstract findById(id: string): Promise<DeliveryPerson | null>
	abstract findByIdWithDetails(id: string): Promise<DeliveryPersonDetails | null>
	abstract findByDocumentNumber(documentNumber: string): Promise<DeliveryPerson | null>
	abstract findByUnique(documentNumber: string, email: string): Promise<DeliveryPerson | null>
	abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<DeliveryPersonDetails[]>>
	abstract findManyBySearchQueries(params: QueryDataLimitParams): Promise<DeliveryPersonDetails[]>
	abstract create(data: DeliveryPerson): Promise<void>
	abstract edit(data: DeliveryPerson): Promise<void>
	abstract editPassword(data: DeliveryPerson): Promise<void>
	abstract delete(data: DeliveryPerson): Promise<void>
	abstract recover(data: DeliveryPerson): Promise<void>
}
