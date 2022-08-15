import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from '../../../common/entities/video/video.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConversionService } from '../../../common/services/conversion.service';
import { RequestService } from '../../../common/services/request.service';
import { UploadVideoDto } from '../../../common/dto/video/upload-vidoe.dto';
import {
   VideoDto,
   VideoSearchFilterDto,
} from '../../../common/dto/video/video.dto';
import { UserEntity } from '../../../common/entities/user/user.entity';
import { isActive } from '../../../common/queries/is-active.query';
import { SystemException } from '../../../common/exceptions/system.exception';
import { UserVideoReactionDto } from '../../../common/dto/video/user-video-reaction.dto';
import { UserVideoReactionEntity } from '../../../common/entities/video/user-video-reaction.entity';
const getVideoId = require('get-video-id');
const getYoutubeTitle = require('get-youtube-title');

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
      private readonly requestService: RequestService,
   ) {}

   uploadVideo = async (uploadVideoDto: UploadVideoDto): Promise<VideoDto> => {
      try {
         const modifiedUploadVideo =
            this.requestService.forCreate(uploadVideoDto);
         const videoData: VideoEntity =
            this.videoRepository.create(modifiedUploadVideo);
         videoData.user = await this.findUserById(uploadVideoDto.uploadedBy);
         const { id } = getVideoId(uploadVideoDto.videoUrl);
         videoData.thumbnail = 'https://img.youtube.com/vi/' + id + '/0.jpg';
         videoData.videoTitle = 'video_' + Date.now();

         const videoSave = await this.videoRepository.save(videoData);
         return this.conversionService.toDto<VideoEntity, VideoDto>(videoSave);
      } catch (e) {
         throw new SystemException(e);
      }
   };

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

   incrementViewCount = async (id: string): Promise<VideoDto> => {
      try {
         const videoEntity = await this.videoRepository.findOne({ id: id });
         videoEntity.viewCount += 1;
         const updatedVideo = await this.videoRepository.save(videoEntity);
         return this.conversionService.toDto<VideoEntity, VideoDto>(
            updatedVideo,
         );
      } catch (e) {
         throw new SystemException(e);
      }
   };

   reactionOnVideo = async (
      userVideoReactionDto: UserVideoReactionDto,
   ): Promise<string> => {
      try {
         const reactionData = await this.userVideoReactionRepository
            .createQueryBuilder('reaction')
            .leftJoinAndSelect('reaction.user', 'user')
            .leftJoinAndSelect('reaction.video', 'video')
            .where('user.id = :uId', { uId: userVideoReactionDto.userId })
            .andWhere('video.id = :vId', {
               vId: userVideoReactionDto.videoId,
            })
            .getOne();

         if (!reactionData) {
            const userVideoReaction =
               this.userVideoReactionRepository.create(userVideoReactionDto);
            userVideoReaction.user = await this.findUserById(
               userVideoReactionDto.userId,
            );
            userVideoReaction.video = await this.findVideoById(
               userVideoReactionDto.videoId,
            );

            if (userVideoReaction.reaction == 1)
               userVideoReaction.video.likeCount += 1;
            else if (userVideoReaction.reaction == 2)
               userVideoReaction.video.disLikeCount += 1;
            await this.videoRepository.save(userVideoReaction.video);
            await this.userVideoReactionRepository.save(userVideoReaction);
            return Promise.resolve('success');
         }

         const video = await this.findVideoById(userVideoReactionDto.videoId);

         if (userVideoReactionDto.reaction == 0) {
            if (reactionData.reaction == 1) {
               video.likeCount -= 1;
            } else if ((reactionData.reaction = 2)) {
               video.disLikeCount -= 1;
            }
            await this.videoRepository.save(video);
            await this.userVideoReactionRepository.delete(reactionData);
            return Promise.resolve('success');
         }

         if (reactionData.reaction == 1 && userVideoReactionDto.reaction == 2) {
            video.likeCount -= 1;
            video.disLikeCount += 1;
         }

         if (reactionData.reaction == 2 && userVideoReactionDto.reaction == 1) {
            video.likeCount += 1;
            video.disLikeCount -= 1;
         }

         await this.videoRepository.save(video);
         reactionData.reaction = userVideoReactionDto.reaction;
         await this.userVideoReactionRepository.save(reactionData);
         return Promise.resolve('success');
      } catch (e) {
         throw new SystemException(e);
      }
   };

   findUserById = async (userId: string): Promise<UserEntity> => {
      try {
         const user = this.userRepository.findOne({ id: userId });
         if (!user) {
            throw new SystemException('User not found!');
         }
         return user;
      } catch (e) {
         throw new SystemException(e);
      }
   };

   findVideoById = async (videoId: string): Promise<VideoEntity> => {
      try {
         const video = this.videoRepository.findOne({ id: videoId });
         if (!video) {
            throw new SystemException('Video not found!');
         }
         return video;
      } catch (e) {
         throw new SystemException(e);
      }
   };
}
