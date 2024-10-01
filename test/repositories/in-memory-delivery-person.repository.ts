/* eslint-disable prettier/prettier */
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit'
import {
	DeliveryPersonRepository,
	FindManyByFiltersParams,
} from '@/domain/logistic/application/repositories/delivery-person.repository'
import { DeliveryPerson } from '@/domain/logistic/enterprise/entities/delivery-person'
import { DeliveryPersonDetails } from '@/domain/logistic/enterprise/entities/value-objects/delivery-person-details'
import { normalizeSearch } from '@/infra/utils/normalize'

export class InMemoryDeliveryPersonRepository
	implements DeliveryPersonRepository
{
	public items: DeliveryPerson[] = []

	async findById(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		return person ?? null
	}
	
	async findByIdWithDetails(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		if (!person) { 
			return null
		}

		return DeliveryPersonDetails.create({
			personId: person.id,
			role: person.role,
			name: person.name,
			documentNumber: person.documentNumber,
			email: person.email,
			phone: person.phone,
			city: person.city,
			state: person.state,
			deletedAt: person.deletedAt ?? null,
		})
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

		items = items.filter((item) => deleted ? !!item.deletedAt : !item.deletedAt)
		
		return {
			data: items.slice(ITEMS_OFFSET_START, ITEMS_OFFSET_END),
			perPage,
			totalPages: Math.ceil(items.length / perPage),
			totalItems: items.length,
		}
	}

	async findManyBySearchQueries({ query, limit }: QueryDataLimitParams) {
		const filter = this.items.filter((person) => {
			const name = normalizeSearch(query, person.name)
			const city = normalizeSearch(query, person.city)
			const state = normalizeSearch(query, person.state)
			const documentNumber = normalizeSearch(query, person.documentNumber)
			const nonDeletedReceiver = !person.deletedAt

			return (name || city || state || documentNumber) && nonDeletedReceiver
		})

		return filter.slice(0, limit).map((person) => {
			return DeliveryPersonDetails.create({
				personId: person.id,
				role: person.role,
				name: person.name,
				documentNumber: person.documentNumber,
				email: person.email,
				phone: person.phone,
				city: person.city,
				state: person.state,
				deletedAt: person.deletedAt ?? null,
			})
		})
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
