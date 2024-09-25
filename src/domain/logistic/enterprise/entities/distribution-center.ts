import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface DistributionCenterProps {
	name: string
	city: string
	state: string
	deletedAt?: Date | null
}

export class DistributionCenter extends Entity<DistributionCenterProps> {
	get name() {
		return this.props.name
	}

	set name(name: string) {
		this.props.name = name
	}

	get city() {
		return this.props.city
	}

	set city(city: string) {
		this.props.city = city
	}

	get state() {
		return this.props.state
	}

	set state(state: string) {
		this.props.state = state
	}

	get deletedAt() {
		return this.props.deletedAt
	}

	deleteDistributionCenter() {
		this.props.deletedAt = new Date()
	}

	recoverDistributionCenter() {
		this.props.deletedAt = null
	}

	static create(props: DistributionCenterProps, id?: UniqueEntityId) {
		const order = new DistributionCenter(props, id)

		return order
	}
}
