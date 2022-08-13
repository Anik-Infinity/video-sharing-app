import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { BaseDto } from "../core/base.dto";

export class UploadVideoDto extends BaseDto{
    @ApiProperty({ default: 'https://youtu.be/KR9wjcC7u-Q', required: true })
    @IsNotEmpty()
    @IsString()
    videoUrl: string;

    @ApiProperty({ default: 'xyz', required: true })
    @IsNotEmpty()
    @IsString()
    uploadedBy: string
}
