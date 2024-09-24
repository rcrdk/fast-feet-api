/* eslint-disable prettier/prettier */
import { Receiver } from '../../enterprise/entities/receiver'

export abstract class ReceiverRepository {
	abstract findById(id: string): Promise<Receiver | null>
	abstract findByUnique(documentNumber: string, email: string): Promise<Receiver | null>
	abstract create(data: Receiver): Promise<void>
	abstract edit(data: Receiver): Promise<void>
	abstract delete(data: Receiver): Promise<void>
	abstract recover(data: Receiver): Promise<void>
}
