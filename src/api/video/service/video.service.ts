import { InjectRepository } from "@nestjs/typeorm";
import { VideoEntity } from "../../../common/entities/video/video.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ConversionService } from "../../../common/services/conversion.service";
import { ExceptionService } from "../../../common/services/exception.service";
import { PermissionService } from "../../../common/services/permission.service";
import { RequestService } from "../../../common/services/request.service";
import { UploadVideoDto } from "../../../common/dto/video/upload-vidoe.dto";
import { VideoDto } from "src/common/dto/video/video.dto";
import { UserEntity } from "../../../common/entities/user/user.entity";

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly videoRepository: Repository<VideoEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
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

    findUserById = async(userId: string): Promise<UserEntity> => {
        return this.userRepository.findOne({id: userId});
    }
}