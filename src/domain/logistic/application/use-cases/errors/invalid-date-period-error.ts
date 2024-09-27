import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidDatePeriodError extends Error implements UseCaseError {
	constructor(start: string, end: string) {
		super(`Invalid date period between "${start}" and "${end}".`)
	}
}
