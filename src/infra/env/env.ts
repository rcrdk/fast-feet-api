import { z } from 'zod'

export const envSchema = z.object({
	DATABASE_URL: z.string(),
	PORT: z.coerce.number().optional().default(3333),
	JWT_SECRET_KEY: z.string(),
	JWT_PUBLIC_KEY: z.string(),
	CLOUDFLARE_ACCOUNT_ID: z.string(),
	AWS_BUCKET: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_KEY: z.string(),
	REDIS_HOST: z.string().optional().default('localhost'),
	REDIS_PORT: z.coerce.number().optional().default(6359),
	REDIS_DATABASE: z.coerce.number().optional().default(0),
})

export type Env = z.infer<typeof envSchema>
