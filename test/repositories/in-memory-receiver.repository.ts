import { ReceiverRepository } from '@/domain/app/application/repositories/receiver.repository'
import { Receiver } from '@/domain/app/enterprise/entities/receiver'

export class InMemoryReceiverRepository implements ReceiverRepository {
	public items: Receiver[] = []

	async findById(id: string) {
		const person = this.items.find((person) => person.id.toString() === id)

		return person ?? null
	}

	async findByUnique(documentNumber: string, email: string) {
		const person = this.items.find((person) => {
			return person.documentNumber === documentNumber || person.email === email
		})

		return person ?? null
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
