export interface PaginationData<A> {
	data: A
	perPage: number
	totalItems: number
	totalPages: number
}
