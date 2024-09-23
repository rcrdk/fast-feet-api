import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from '@/infra/env/env'

import { AuthModule } from './auth/auth.module'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/event.module'
import { HttpModule } from './http/http.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		AuthModule,
		HttpModule,
		EventsModule,
		EnvModule,
	],
})
export class AppModule {}
