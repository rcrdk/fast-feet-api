/* eslint-disable prettier/prettier */
import {
	DeliveryPersonRepository,
	FindManyByFiltersParams,
} from '@/domain/logistic/application/repositories/delivery-person.repository'
import { DeliveryPerson } from '@/domain/logistic/enterprise/entities/delivery-person'
import { normalizeSearch } from '@/infra/utils/normalize'

export class InMemoryDeliveryPersonRepository
	implements DeliveryPersonRepository
{
	public items: DeliveryPerson[] = []

	async findById(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		return person ?? null
	}

	async findByDocumentNumber(documentNumber: string) {
		const person = this.items.find(
			(person) => person.documentNumber === documentNumber,
		)

		return person ?? null
	}

	async findByUnique(documentNumber: string, email: string) {
		const person = this.items.find((person) => {
			return person.documentNumber === documentNumber || person.email === email
		})

		return person ?? null
	}

	async findManyByFilters({
		name,
		city,
		state,
		deleted,
		page,
		perPage,
	}: FindManyByFiltersParams) {
		const ITEMS_OFFSET_START = (page - 1) * perPage
		const ITEMS_OFFSET_END = page * perPage

		let items = this.items

		if (name) items = items.filter((item) => normalizeSearch(name, item.name))
		if (city) items = items.filter((item) => normalizeSearch(city, item.city))
		if (state) items = items.filter((item) => normalizeSearch(state, item.state))

		if (deleted) {
			items = items.filter((item) => !!item.deletedAt)
		} else {
			items = items.filter((item) => !item.deletedAt)
		}

		return {
			data: items.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END),
			perPage,
			totalPages: Math.ceil(items.length / perPage),
			totalItems: items.length,
		}
	}

	async create(data: DeliveryPerson) {
		this.items.push(data)
	}

	async edit(data: DeliveryPerson) {
		const index = this.items.findIndex((item) => item.id === data.id)

		this.items[index] = data
	}

	async delete(data: DeliveryPerson) {
		const index = this.items.findIndex((item) => item.id === data.id)

		data.deletePerson()
		this.items[index] = data
	}

	async recover(data: DeliveryPerson) {
		const index = this.items.findIndex((item) => item.id === data.id)

		data.recoverPerson()
		this.items[index] = data
	}
}
