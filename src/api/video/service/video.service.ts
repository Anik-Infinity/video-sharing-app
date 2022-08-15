import { InjectRepository } from "@nestjs/typeorm";
import { VideoEntity } from "../../../common/entities/video/video.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ConversionService } from "../../../common/services/conversion.service";
import { ExceptionService } from "../../../common/services/exception.service";
import { PermissionService } from "../../../common/services/permission.service";
import { RequestService } from "../../../common/services/request.service";
import { UploadVideoDto } from "../../../common/dto/video/upload-vidoe.dto";
import { VideoDto, VideoSearchFilterDto } from "../../../common/dto/video/video.dto";
import { UserEntity } from "../../../common/entities/user/user.entity";
import { isActive } from "../../../common/queries/is-active.query";
import { SystemException } from "../../../common/exceptions/system.exception";
import { async } from "rxjs";
import { UserVideoReactionDto } from "../../../common/dto/video/user-video-reaction.dto";
import { UserVideoReactionEntity } from "../../../common/entities/video/user-video-reaction.entity";

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly videoRepository: Repository<VideoEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(UserVideoReactionEntity)
        private readonly userVideoReactionRepository: Repository<UserVideoReactionEntity>,
        private readonly conversionService: ConversionService,
        private readonly exceptionService: ExceptionService,
        private readonly permissionService: PermissionService,
        private readonly requestService: RequestService,
    ) {}

    uploadVideo = async (
        uploadVideoDto: UploadVideoDto 
    ): Promise<VideoDto> => {
        const modifiedUploadVideo = this.requestService.forCreate(uploadVideoDto);
        const videoData: VideoEntity = this.videoRepository.create(modifiedUploadVideo);
        videoData.user = await this.findUserById(uploadVideoDto.uploadedBy);
        const videoSave = await this.videoRepository.save(videoData);
        return this.conversionService.toDto<VideoEntity, VideoDto>(videoSave);
    }

    pagination = async (
        page: number,
        limit: number,
        sort: string,
        order: 'ASC' | 'DESC',
        videoSearchFilter: VideoSearchFilterDto,
    ): Promise<[VideoDto[], number]> => {
        try {
            const query = await this.videoRepository
                .createQueryBuilder('video')
                .leftJoinAndSelect('video.user', 'user')
                .where('video.isActive = :isActive', { ...isActive });

            sort === 'updatedAt'
                ? (sort = 'video.updatedAt')
                : (sort = 'video.createdAt');

            query
                .orderBy(sort, order)
                .skip((page - 1) * limit)
                .take(limit);

            const videoData = await query.getManyAndCount();

            return this.conversionService.toPagination<VideoEntity, VideoDto>(
                videoData,
            );
        } catch (error) {
            throw new SystemException(error);
        }
    };

    incrementViewCount = async(id: string): Promise<VideoDto> => {
        const videoEntity = await this.videoRepository.findOne({id: id});
        videoEntity.viewCount += 1;
        const updatedVideo = await this.videoRepository.save(videoEntity);
        return this.conversionService.toDto<VideoEntity, VideoDto>(updatedVideo);
    }

    reactionOnVideo = async(userVideoReactionDto: UserVideoReactionDto): Promise<UserVideoReactionDto> => {
        const reactionData = await this.userVideoReactionRepository.createQueryBuilder('reaction')
            .leftJoinAndSelect('reaction.user', 'user')
            .leftJoinAndSelect('reaction.video', 'video')
            .where('user.id = :uId', {uId: userVideoReactionDto.userId})
            .andWhere('video.id = :vId',{vId: userVideoReactionDto.videoId})
            .getOne();
            
        if(!reactionData) {
            const userVideoReaction = this.userVideoReactionRepository.create(userVideoReactionDto);
            userVideoReaction.user = await this.findUserById(userVideoReactionDto.userId);
            userVideoReaction.video = await this.findVideoById(userVideoReactionDto.videoId);

            if(userVideoReaction.reaction == 1) userVideoReaction.video.likeCount += 1;
            else if(userVideoReaction.reaction == 2) userVideoReaction.video.disLikeCount += 1; 
            await this.videoRepository.save(userVideoReaction.video)

            const save = await this.userVideoReactionRepository.save(userVideoReaction);
            return this.conversionService.toDto<UserVideoReactionEntity, UserVideoReactionDto>(save);
        }
        reactionData.reaction = userVideoReactionDto.reaction;
        const updateData = await this.userVideoReactionRepository.save(reactionData);
        return this.conversionService.toDto<UserVideoReactionEntity, UserVideoReactionDto>(updateData);
    }

    findUserById = async(userId: string): Promise<UserEntity> => {
        return this.userRepository.findOne({id: userId});
    }

    findVideoById = async(videoId: string): Promise<VideoEntity> => {
        return this.videoRepository.findOne({id: videoId});
    }

}
