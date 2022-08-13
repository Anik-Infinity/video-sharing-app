import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../../../common/dto/reponse/response.dto";
import { ResponseService } from "../../../common/services/response.service";
import { UploadVideoDto } from "../../../common/dto/video/upload-vidoe.dto";
import { VideoService } from "../service/video.service";
import { DtoValidationPipe } from "../../../common/pipes/dto-validation.pipe";
import { PaginationDecorator } from "../../../common/decorator/pagination.decorator";
import { PaginationDTO } from "../../../common/dto/pagination/pagination.dto";
import { VideoSearchFilterDto } from "../../../common/dto/video/video.dto";
import { UuidValidationPipe } from "../../../common/pipes/uuid-validation.pipe";
import { UserVideoReactionDto } from "../../../common/dto/video/user-video-reaction.dto";

@ApiBearerAuth()
@ApiTags('Videos')
@Controller('video')
export class VideoController {

    constructor(
        private readonly videoService: VideoService,
        private readonly responseService: ResponseService,
    ) {}

    @ApiBody({ type: UploadVideoDto })
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        description: 'video upload endpoint',
    })
    @HttpCode(HttpStatus.CREATED)
    @Post()
    uploadVideo(
        @Body(
            new DtoValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        )
        uploadVideoDto: UploadVideoDto,
    ): Promise<ResponseDto> {
        const videoDto = this.videoService.uploadVideo(uploadVideoDto);
        return this.responseService.toDtoResponse(
            HttpStatus.CREATED,
            'vido uploaded successfully',
            videoDto,
        );
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'video pagination list',
    })
    @HttpCode(HttpStatus.OK)
    @Get('pagination')
    pagination(
        @PaginationDecorator() pagination: PaginationDTO,
        @Query() videoSearchFilter: VideoSearchFilterDto,
    ): Promise<ResponseDto> {
        const videos = this.videoService.pagination(
            pagination.page,
            pagination.limit,
            pagination.sort,
            pagination.order === 'ASC' ? 'ASC' : 'DESC',
            videoSearchFilter,
        );
        return this.responseService.toPaginationResponse(
            HttpStatus.OK,
            'video pagination list',
            pagination.page,
            pagination.limit,
            videos,
        );
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'video view increment',
    })
    @HttpCode(HttpStatus.OK)
    @Get('increment-view-count/:id')
    incrementViewCount(@Param('id', new UuidValidationPipe()) id: string,): Promise<ResponseDto> {
        const video = this.videoService.incrementViewCount(id);
        return this.responseService.toDtoResponse(
            HttpStatus.CREATED,
            'vido view incremented',
            video,
        );
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'video reaction',
    })
    @HttpCode(HttpStatus.OK)
    @Get('reaction/:userId/:videoId')
    reactionOnVideo(@Body(
        new DtoValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })) userVideoReactionDto: UserVideoReactionDto) {
            this.videoService.reactionOnVideo(userVideoReactionDto);
    }



    
}