import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AttachmentProps {
	orderStatusId?: UniqueEntityId | null
	url: string
}

export class Attachment extends Entity<AttachmentProps> {
	get url() {
		return this.props.url
	}

	set url(url: string) {
		this.props.url = url
	}

	get orderStatusId() {
		return this.props.orderStatusId
	}

	set orderStatusId(orderStatusId: UniqueEntityId | null | undefined) {
		this.props.orderStatusId = orderStatusId
	}

	static create(props: AttachmentProps, id?: UniqueEntityId) {
		const attachment = new Attachment(props, id)

		return attachment
	}
}
