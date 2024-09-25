/* eslint-disable prettier/prettier */
import { Receiver } from '../../enterprise/entities/receiver'

export interface FindByUnique {
	documentNumber: string
	email: string
}

export abstract class ReceiverRepository {
	abstract findById(id: string): Promise<Receiver | null>
	abstract findByUnique(props: FindByUnique): Promise<Receiver | null>
	abstract findManyBySearchQueries(query: string): Promise<Receiver[]>
	abstract create(data: Receiver): Promise<void>
	abstract edit(data: Receiver): Promise<void>
	abstract delete(data: Receiver): Promise<void>
	abstract recover(data: Receiver): Promise<void>
}
