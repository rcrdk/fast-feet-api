import { DeliveryPersonRepository } from '@/domain/app/application/repositories/delivery-person.repository'
import { DeliveryPerson } from '@/domain/app/enterprise/entities/delivery-person'

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
