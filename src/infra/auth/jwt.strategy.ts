import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { EnvService } from '../env/env.service'

const tokenPayloadSchema = z.object({
	sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

function fromCookies(request: Request) {
	if (request && request.cookies) {
		return request.signedCookies.Authentication
	}

	return null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private config: EnvService) {
		const publicKey = config.get('JWT_PUBLIC_KEY')

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				fromCookies,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: Buffer.from(publicKey, 'base64'),
			algorithms: ['RS256'],
		})
	}

	async validate(payload: UserPayload) {
		return tokenPayloadSchema.parse(payload)
	}
}
