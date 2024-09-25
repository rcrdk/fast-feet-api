import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'
import {
	FindByUnique,
	ReceiverRepository,
} from '@/domain/logistic/application/repositories/receiver.repository'
import { Receiver } from '@/domain/logistic/enterprise/entities/receiver'
import { normalizeSearch } from '@/infra/utils/normalize'

export class InMemoryReceiverRepository implements ReceiverRepository {
	public items: Receiver[] = []

	async findById(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		return person ?? null
	}

	async findByUnique({ documentNumber, email }: FindByUnique) {
		const person = this.items.find((person) => {
			return person.documentNumber === documentNumber || person.email === email
		})

		return person ?? null
	}

	async findManyBySearchQueries({ query, limit }: QueryDataLimitParams) {
		const filter = this.items.filter((person) => {
			const name = normalizeSearch(query, person.name)
			const documentNumber = normalizeSearch(query, person.documentNumber)

			return name || documentNumber
		})

		return filter.slice(0, limit)
	}

	async create(data: Receiver) {
		this.items.push(data)
	}

	async edit(data: Receiver) {
		const index = this.items.findIndex((item) => item.id === data.id)

		this.items[index] = data
	}

	async delete(data: Receiver) {
		const index = this.items.findIndex((item) => item.id === data.id)

		data.deleteReceiver()
		this.items[index] = data
	}

	async recover(data: Receiver) {
		const index = this.items.findIndex((item) => item.id === data.id)

		data.recoverReceiver()
		this.items[index] = data
	}
}
