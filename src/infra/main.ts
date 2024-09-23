import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const envService = app.get(EnvService)

	const port = envService.get('PORT')
	const secret = envService.get('JWT_SECRET_KEY')

	app.use(cookieParser(secret))
	app.enableCors({
		origin: ['http://localhost:3333/'],
		credentials: true,
	})

	await app.listen(port)
}
bootstrap()
