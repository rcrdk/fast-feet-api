import { Module } from '@nestjs/common'

import { CacheModule } from '../cache/cache.module'
import { PrismaService } from './prisma/prisma.service'

@Module({
	imports: [CacheModule],
	providers: [PrismaService],
	exports: [PrismaService],
})
export class DatabaseModule {}
