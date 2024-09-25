import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidQueryLengthError extends Error implements UseCaseError {
	constructor(min: number) {
		super(`A query with ${min}" cheracters must be provied.`)
	}
}
