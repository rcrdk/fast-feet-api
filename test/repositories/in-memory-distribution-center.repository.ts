import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'
import {
	DistributionCenterRepository,
	FindManyByFiltersParams,
} from '@/domain/logistic/application/repositories/distribution-center.repository'
import { DistributionCenter } from '@/domain/logistic/enterprise/entities/distribution-center'
import { DistributionCenterDetails } from '@/domain/logistic/enterprise/entities/value-objects/distribution-center-details'
import { normalizeSearch } from '@/infra/utils/normalize'

// eslint-disable-next-line prettier/prettier
export class InMemoryDistributionCenterRepository implements DistributionCenterRepository {
	public items: DistributionCenter[] = []

	async findById(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		return person ?? null
	}

	async findByIdWithDetails(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		if (!person) {
			return null
		}

		return DistributionCenterDetails.create({
			distributionCenterId: person.id,
			name: person.name,
			city: person.city,
			state: person.state,
			deletedAt: person.deletedAt ?? null,
		})
	}

	async findManyByQuery({ query, limit }: QueryDataLimitParams) {
		const filter = this.items.filter((place) => {
			const name = normalizeSearch(query, place.name)
			const city = normalizeSearch(query, place.city)
			const state = normalizeSearch(query, place.state)
			const nonDeletedPlace = !place.deletedAt

			return (name || city || state) && nonDeletedPlace
		})

		return filter.slice(0, limit).map((item) => {
			return DistributionCenterDetails.create({
				distributionCenterId: item.id,
				name: item.name,
				city: item.city,
				state: item.state,
				deletedAt: item.deletedAt ?? null,
			})
		})
	}

	async findManyByFilters({
		query,
		deleted,
		page,
		perPage,
	}: FindManyByFiltersParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		const items = this.items.filter((place) => {
			const name = normalizeSearch(query, place.name)
			const city = normalizeSearch(query, place.city)
			const state = normalizeSearch(query, place.state)

			const wasDeleted = deleted ? !!place.deletedAt : !place.deletedAt

			return (name || city || state) && wasDeleted
		})

		return {
			data: items.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END),
			perPage,
			totalPages: Math.ceil(items.length / perPage),
			totalItems: items.length,
		}
	}

	async create(data: DistributionCenter) {
		this.items.push(data)
	}

	async edit(data: DistributionCenter) {
		const index = this.items.findIndex((item) => item.id === data.id)

		this.items[index] = data
	}

	async delete(data: DistributionCenter) {
		const index = this.items.findIndex((item) => item.id === data.id)

		data.deleteDistributionCenter()
		this.items[index] = data
	}

	async recover(data: DistributionCenter) {
		const index = this.items.findIndex((item) => item.id === data.id)

		data.recoverDistributionCenter()
		this.items[index] = data
	}
}
