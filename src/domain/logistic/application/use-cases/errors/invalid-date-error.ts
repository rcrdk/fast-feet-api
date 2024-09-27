import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidDateError extends Error implements UseCaseError {
	constructor(date: string, property: string) {
		super(`Invalid date for "${property}": ${date}.`)
	}
}
