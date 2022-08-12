import { Type } from "class-transformer";
import { BaseDto } from "../core/base.dto";
import { UserDto } from "../user/model/user.dto";

export class VideoDto extends BaseDto {
    videoUrl: string;
    
    videoTitle: string;

    videoId: string;

    likeCount: number;

    disLikeCount: number;

    viewCount: number;

    @Type(() => UserDto)
    uploadedBy: UserDto;
}