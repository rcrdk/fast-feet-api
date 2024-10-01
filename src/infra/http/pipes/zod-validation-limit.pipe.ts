import { BadRequestException, PipeTransform } from '@nestjs/common'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

/**
 * @param limit
 * @returns transforms string into a number of max items of a list.
 * @description The default value is 15 and can be set to between 1 and 50.
 */
export class ZodValidationLimitPipe implements PipeTransform {
	transform(value: string) {
		const schema = z.coerce.number().min(1).max(50).optional().default(15)

		try {
			const parsedValue = schema.parse(value)
			return parsedValue
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					message: "Invalid 'limit' value, inform a number between 1 and 50.",
					statusCode: 400,
					errors: fromZodError(error),
				})
			}

			throw new BadRequestException('Validation failed.')
		}
	}
}
