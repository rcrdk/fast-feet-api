import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'
import { DistributionCenterRepository } from '@/domain/logistic/application/repositories/distribution-center.repository'
import { DistributionCenter } from '@/domain/logistic/enterprise/entities/distribution-center'
import { normalizeSearch } from '@/infra/utils/normalize'

// eslint-disable-next-line prettier/prettier
export class InMemoryDistributionCenterRepository implements DistributionCenterRepository {
	public items: DistributionCenter[] = []

	async findById(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		return person ?? null
	}

	async findManyByQuery({ query, limit }: QueryDataLimitParams) {
		const filter = this.items.filter((place) => {
			const name = normalizeSearch(query, place.name)
			const city = normalizeSearch(query, place.city)
			const state = normalizeSearch(query, place.state)
			const nonDeletedPlace = !place.deletedAt

			return (name || city || state) && nonDeletedPlace
		})

		return filter.slice(0, limit)
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
