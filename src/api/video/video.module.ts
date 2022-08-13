import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVideoReactionEntity } from '../../common/entities/video/user-video-reaction.entity';
import { UserEntity } from '../../common/entities/user/user.entity';
import { VideoEntity } from '../../common/entities/video/video.entity';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';
import { PermissionService } from '../../common/services/permission.service';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { VideoController } from './controller/video.controller';
import { VideoService } from './service/video.service';

@Module({
    imports: [TypeOrmModule.forFeature([VideoEntity, UserEntity, UserVideoReactionEntity])],
    controllers: [VideoController],
    providers: [
        VideoService,
        ResponseService,
        ConversionService,
        ExceptionService,
        PermissionService,
        RequestService,
    ],
})
export class VideoModule {}
