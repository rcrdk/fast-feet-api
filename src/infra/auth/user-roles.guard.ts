import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { UserRoles } from '@/core/repositories/roles'

import { USER_ROLES_KEY } from './user-roles.decorator'

@Injectable()
export class UserRolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
			USER_ROLES_KEY,
			[context.getHandler(), context.getClass()],
		)

		if (!requiredRoles) {
			return true
		}

		const { user } = context.switchToHttp().getRequest()

		if (!requiredRoles.includes(user.role)) {
			throw new UnauthorizedException('Access not allowed.')
		}

		return true
	}
}
