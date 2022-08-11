import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dto/reponse/user-response.dto';
import { SystemException } from '../exceptions/system.exception';


@Injectable()
export class UserGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const req = ctx.getRequest<Request>();
        const user = req['_user'] as UserResponseDto;
        const error = { isGuard: true };

        if (!user) {
            throw new SystemException(error);
        }

        if (
            user.isSuperAdmin ||
            user.isAdmin ||
            user.isLibrarian ||
            user.isAcademic ||
            user.isStudent
        ) {
            return true;
        }

        throw new SystemException(error);
    }
}
