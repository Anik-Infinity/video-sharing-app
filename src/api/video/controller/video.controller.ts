import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../../../common/dto/reponse/response.dto";
import { ResponseService } from "../../../common/services/response.service";
import { UploadVideoDto } from "../../../common/dto/video/upload-vidoe.dto";
import { VideoService } from "../service/video.service";
import { DtoValidationPipe } from "../../../common/pipes/dto-validation.pipe";

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
}