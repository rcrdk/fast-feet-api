import { UseCaseError } from '@/core/errors/use-case-error'

/**
 * @example
 * Some search queries are missing: {queries}
 * @queries
 * String of required params
 */
export class InvalidSearchQueryError extends Error implements UseCaseError {
	constructor(queries: string) {
		super(`Some search queries are missing: ${queries}`)
	}
}
