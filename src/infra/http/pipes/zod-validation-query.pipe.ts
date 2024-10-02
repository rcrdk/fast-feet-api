import { BadRequestException, PipeTransform } from '@nestjs/common'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

/**
 * @param query
 * @returns validated query with min characters
 */
export class ZodValidationQueryPipe implements PipeTransform {
	transform(value: string) {
		const schema = z.string().min(2)

		try {
			const parsedValue = schema.parse(value)
			return parsedValue
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					message: "Invalid 'query' value.",
					statusCode: 400,
					errors: fromZodError(error),
				})
			}

			throw new BadRequestException('Validation failed.')
		}
	}
}
