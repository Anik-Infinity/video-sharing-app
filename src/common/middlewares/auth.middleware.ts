import {
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ErrorDto } from '../dto/reponse/error.dto';
import { ResponseDto } from '../dto/reponse/response.dto';
import { SystemErrorDto } from '../dto/reponse/system-error.dto';
import { Redis } from '../enum/redis.enum';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    private static toResponse(res: Response, message: string): Response {
        const systemErrorDto = new SystemErrorDto(
            'UNAUTHORIZED',
            'Error',
            message,
        );
        const errorDto = new ErrorDto(null, systemErrorDto);

        const responseDto = new ResponseDto(
            new Date().getTime(),
            HttpStatus.UNAUTHORIZED,
            message,
            errorDto,
            null,
        );

        return res.json(responseDto);
    }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers['authorization']?.split('Bearer ')[1];

            if (!token) {
                return AuthMiddleware.toResponse(
                    res,
                    'Token is not found in request header',
                );
            }

            const privateKEY = this.configService
                .get('PRIVATE_KEY')
                .replace(/\\n/g, '\n');

            jwt.verify(
                token,
                privateKEY,
                {
                    algorithms: ['RS256'],
                },
                (err, decoded) => {
                    if (err) {
                        return AuthMiddleware.toResponse(
                            res,
                            'Token is Invalid!!',
                        );
                    }
                    const token: any = decoded;
                },
            );

            const sessionTime = await this.cache.store.ttl(token);
            
            if (sessionTime <= 0) {
                return AuthMiddleware.toResponse(
                    res,
                    'Expired due to Inactivity',
                );
            } 

            next();
        } catch (error) {
            return AuthMiddleware.toResponse(res, 'Authorization is denied');
        }
    }
}
