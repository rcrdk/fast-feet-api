import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidQueryLengthError extends Error implements UseCaseError {
	constructor(min: number | string) {
		super(`A query with ${min} characters must be provied.`)
	}
}
