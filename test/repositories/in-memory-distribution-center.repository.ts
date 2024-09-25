import { DistributionCenterRepository } from '@/domain/app/application/repositories/distribution-center.repository'
import { DistributionCenter } from '@/domain/app/enterprise/entities/distribution-center'
import { normalizeSearch } from '@/infra/utils/normalize'

// eslint-disable-next-line prettier/prettier
export class InMemoryDistributionCenterRepository implements DistributionCenterRepository {
	public items: DistributionCenter[] = []

	async findById(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		return person ?? null
	}

	async findManyByQuery(query: string) {
		const filter = this.items.filter((person) => {
			const name = normalizeSearch(query, person.name)
			const city = normalizeSearch(query, person.city)
			const state = normalizeSearch(query, person.state)

			return name || city || state
		})

		return filter
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
