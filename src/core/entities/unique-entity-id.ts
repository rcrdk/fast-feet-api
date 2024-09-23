import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
	public value: string

	toString() {
		return this.value
	}

	constructor(value?: string) {
		this.value = value ?? randomUUID()
	}

	equals(id: UniqueEntityId) {
		return id.toString() === this.value
	}
}
