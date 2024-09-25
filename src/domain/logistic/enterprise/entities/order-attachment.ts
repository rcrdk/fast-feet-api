import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface OrderAttachmentProps {
	orderId: UniqueEntityId
	url: string
}

export class OrderAttachment extends Entity<OrderAttachmentProps> {
	get url() {
		return this.props.url
	}

	set url(url: string) {
		this.props.url = url
	}

	static create(props: OrderAttachmentProps, id?: UniqueEntityId) {
		const orderAttachment = new OrderAttachment(props, id)

		return orderAttachment
	}
}
