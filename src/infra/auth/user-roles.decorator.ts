import { SetMetadata } from '@nestjs/common'
import { UserRole } from '@prisma/client'

export const USER_ROLES_KEY = 'roles'
export const Roles = (...roles: UserRole[]) =>
	SetMetadata(USER_ROLES_KEY, roles)
