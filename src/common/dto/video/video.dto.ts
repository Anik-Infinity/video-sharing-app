import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { BaseDto } from "../core/base.dto";
import { ApiQueryPaginationBaseDTO } from "../pagination/api-query-pagination-base.dto";
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

export class VideoSearchFilterDto extends ApiQueryPaginationBaseDTO {
    
    @ApiProperty({
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    fromDate: string;

    @ApiProperty({
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    toDate: string;
}
