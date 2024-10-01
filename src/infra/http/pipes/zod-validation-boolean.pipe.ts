import { BadRequestException, PipeTransform } from '@nestjs/common'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

/**
 * @param [any boolean]
 * @returns transforms string into a boolean.
 * @description To get a false the value must be '0' or 'false'.
 * @description To get a true the value must be '1', 'true' or any other value.
 */
export class ZodValidationBooleanPipe implements PipeTransform {
	transform(value: string) {
		const schema = z.preprocess((val) => {
			if (typeof val === 'string') {
				if (['1', 'true'].includes(val.toLowerCase())) return true
				if (['0', 'false'].includes(val.toLowerCase())) return false
			}
			return val
		}, z.coerce.boolean())

		try {
			const parsedValue = schema.parse(value)
			return parsedValue
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					message: 'Invalid boolean value.',
					statusCode: 400,
					errors: fromZodError(error),
				})
			}

			throw new BadRequestException('Validation failed.')
		}
	}
}
