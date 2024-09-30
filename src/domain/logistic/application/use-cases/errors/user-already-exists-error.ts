import { UseCaseError } from '@/core/errors/use-case-error'

export class UserAlreadyExistsError extends Error implements UseCaseError {
	constructor(identifier: string) {
		super(`User with ${identifier} already exists.`)
	}
}
