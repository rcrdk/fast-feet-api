import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface DistributionCenterDetailsProps {
	distributionCenterId: UniqueEntityId
	name: string
	city: string
	state: string
	deletedAt: Date | null
}

export class DistributionCenterDetails extends ValueObject<DistributionCenterDetailsProps> {
	get distributionCenterId() {
		return this.props.distributionCenterId
	}

	get name() {
		return this.props.name
	}

	get city() {
		return this.props.city
	}

	get state() {
		return this.props.state
	}

	get deletedAt() {
		return this.props.deletedAt
	}

	static create(props: DistributionCenterDetailsProps) {
		return new DistributionCenterDetails(props)
	}
}
