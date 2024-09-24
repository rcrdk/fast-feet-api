import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Person, PersonProps } from './person'

export interface AdministratorProps extends PersonProps {}

export class Administrator extends Person<AdministratorProps> {
	static create(props: AdministratorProps, id?: UniqueEntityId) {
		const person = new Administrator(props, id)

		return person
	}
}
