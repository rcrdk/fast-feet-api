import { UseCaseError } from '@/core/errors/use-case-error'

/**
 * @example
 * Inform at least one of there queies with at least two characters: {queries}
 * @queries
 * String of required params
 */
export class MinQuerySearchNotProviedError
	extends Error
	implements UseCaseError
{
	constructor(queries: string) {
		super(
			`You must provide one of these parameters with at least two characters: ${queries}`,
		)
	}
}
