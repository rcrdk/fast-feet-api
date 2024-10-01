import { BadRequestException, PipeTransform } from '@nestjs/common'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

/**
 * @param page
 * @returns transforms string into a number of current list page
 * @description The default value is 1 and can be set to from 1.
 */
export class ZodValidationPagePipe implements PipeTransform {
	transform(value: string) {
		const schema = z.coerce.number().min(1).optional().default(1)

		try {
			const parsedValue = schema.parse(value)
			return parsedValue
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					message: "Invalid 'page' value, inform a value starting from 1.",
					statusCode: 400,
					errors: fromZodError(error),
				})
			}

			throw new BadRequestException('Validation failed.')
		}
	}
}
