import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dto/reponse/user-response.dto';
import { SystemException } from '../exceptions/system.exception';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const error = { isGuard: true };

        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();
        const user = req['_user'] as UserResponseDto;

        if (!user) {
            throw new SystemException(error);
        }

        if (user.isSuperAdmin) {
            return true;
        }

        throw new SystemException(error);
    }
}
