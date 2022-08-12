import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '../entities/user/admin.entity';
import { StudentEntity } from '../entities/user/student.entity';
import { UserEntity } from '../entities/user/user.entity';
import { VideoEntity } from '../entities/video/video.entity';
import { configEnvironment } from '../env-config/env-config';
@Module({
    imports: [
        configEnvironment(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get('DATABASE_USER'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_DB'),
                synchronize: configService.get('DATABASE_SYNCRONIZE'),
                logging: configService.get('DATABASE_LOGGING'),
                entities: [
                    UserEntity,
                    StudentEntity,
                    AdminEntity,
                    VideoEntity
                ],
            }),
            inject: [ConfigService],
        }),
    ],
})
export class TypeormConfigModule {}
