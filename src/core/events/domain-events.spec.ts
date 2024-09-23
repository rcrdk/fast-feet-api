import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
	public ocurredAt: Date
	private aggregate: CustomAggregate //eslint-disable-line

	constructor(aggregate: CustomAggregate) {
		this.aggregate = aggregate
		this.ocurredAt = new Date()
	}

	public getAggregateId(): UniqueEntityId {
		return this.aggregate.id
	}
}

class CustomAggregate extends AggregateRoot<unknown> {
	static create() {
		const aggregate = new CustomAggregate(null)

		aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

		return aggregate
	}
}

describe('domain events', () => {
	it('should be able to dispatch and listen to events', () => {
		const callbackSpy = vi.fn()

		// Subscriber created, listening to created event
		DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

		// Createting response without persisting
		const aggregate = CustomAggregate.create()

		// Ensure that event was created and not dispached
		expect(aggregate.domainEvents).toHaveLength(1)

		// Saving response on DB and dispatching event
		DomainEvents.dispatchEventsForAggregate(aggregate.id)

		// The subscriber listen to event and do what it needs to
		expect(callbackSpy).toHaveBeenCalled()
		expect(aggregate.domainEvents).toHaveLength(0)
	})
})
