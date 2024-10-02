import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'
import {
	FindByUnique,
	FindManyByFiltersParams,
	ReceiverRepository,
} from '@/domain/logistic/application/repositories/receiver.repository'
import { Receiver } from '@/domain/logistic/enterprise/entities/receiver'
import { ReceiverDetails } from '@/domain/logistic/enterprise/entities/value-objects/receiver-details'
import { normalizeSearch } from '@/infra/utils/normalize'

export class InMemoryReceiverRepository implements ReceiverRepository {
	public items: Receiver[] = []

	async findById(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		return person ?? null
	}

	async findByIdWithDetails(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		if (!person) {
			return null
		}

		return ReceiverDetails.create({
			receiverId: person.id,
			name: person.name,
			documentNumber: person.documentNumber,
			phone: person.phone,
			email: person.email,
			address: person.address,
			city: person.city,
			state: person.state,
			neighborhood: person.neighborhood,
			zipCode: person.zipCode,
			reference: person.reference ?? null,
			deletedAt: person.deletedAt ?? null,
		})
	}

	async findByUnique({ documentNumber, email }: FindByUnique) {
		const person = this.items.find((person) => {
			return person.documentNumber === documentNumber || person.email === email
		})

		return person ?? null
	}

	async findByDocumentNumber(documentNumber: string) {
		const person = this.items.find((person) => {
			return person.documentNumber === documentNumber
		})

		return person ?? null
	}

	async findManyBySearchQueries({ query, limit }: QueryDataLimitParams) {
		const filter = this.items.filter((person) => {
			const name = normalizeSearch(query, person.name)
			const documentNumber = normalizeSearch(query, person.documentNumber)
			const nonDeletedReceiver = !person.deletedAt

			return (name || documentNumber) && nonDeletedReceiver
		})

		return filter.slice(0, limit)
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
			const documentNumber = normalizeSearch(query, place.documentNumber)

			const wasDeleted = deleted ? !!place.deletedAt : !place.deletedAt

			return (name || documentNumber) && wasDeleted
		})

		return {
			data: items.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END),
			perPage,
			totalPages: Math.ceil(items.length / perPage),
			totalItems: items.length,
		}
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
