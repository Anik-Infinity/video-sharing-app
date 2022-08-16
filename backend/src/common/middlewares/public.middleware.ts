import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    Logger,
    NestMiddleware,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class PublicMiddleware implements NestMiddleware {
    private readonly logger = new Logger(PublicMiddleware.name);

    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authorization']?.split('Bearer ')[1];

            this.logger.log('public middleware initialized', token);

            if (token) {
                const payload: any = await this.cache.get(token);
                if (payload) req['_user'] = payload;
            }

            next();
        } catch (error) {
            this.logger.error(error);
            return;
        }
    }
}
