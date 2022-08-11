import {
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseDto } from '../dto/core/base.dto';
import { UserResponseDto } from '../dto/reponse/user-response.dto';
import { CustomBaseEntity } from '../entities/core/custom-base.entity';

@Injectable()
export class RequestService {
    constructor(@Inject(REQUEST) private readonly request: Request) {}

    forCreate<T extends BaseDto>(dto: T): T {
        if (dto) {
            dto.createdAt = new Date();
            dto.createdBy = this.request['_user']?.userId || null;

            dto.updatedAt = new Date();
            dto.updatedBy = dto.createdBy;

            return dto;
        } else {
            throw new NotFoundException('No data specified!');
        }
    }

    forCreateEntity<T extends CustomBaseEntity>(entity: T): T {
        if (entity) {
            entity.createdAt = new Date();
            entity.createdBy = this.request['_user']?.userId || null;

            entity.updatedAt = new Date();
            entity.updatedBy = entity.createdBy;

            return entity;
        } else {
            throw new NotFoundException('No data specified!');
        }
    }

    forUpdate<T extends BaseDto>(dto: T): T {
        if (dto) {
            dto.updatedAt = new Date();
            dto.updatedBy = this.request['_user']?.userId || null;

            return dto;
        } else {
            throw new NotFoundException('No data specified!');
        }
    }

    forUpdateEntity<T extends CustomBaseEntity>(entity: T): T {
        if (entity) {
            entity.updatedAt = new Date();
            entity.updatedBy = this.request['_user']?.userId || null;

            return entity;
        } else {
            throw new NotFoundException('No data specified!');
        }
    }

    userSession(): UserResponseDto {
        try {
            const user: UserResponseDto = this.request['_user'] || null;
            if (user) {
                return user;
            } else {
                throw new UnauthorizedException('You are not Loggin');
            }
        } catch (error) {
            throw new UnauthorizedException('You are not Loggin');
        }
    }
}
