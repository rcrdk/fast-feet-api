/* eslint-disable prettier/prettier */
import { DeliveryPerson } from "../../enterprise/entities/delivery-person";

export abstract class DeliveryPersonRepository {
	abstract findById(id: string): Promise<DeliveryPerson | null>
	abstract findByDocumentNumber(documentNumber: string): Promise<DeliveryPerson | null>
	abstract findByUnique(documentNumber: string, email: string): Promise<DeliveryPerson | null>
	abstract create(data: DeliveryPerson): Promise<void>
	abstract edit(data: DeliveryPerson): Promise<void>
	abstract delete(data: DeliveryPerson): Promise<void>
}
