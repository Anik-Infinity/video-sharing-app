import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Reaction } from "../../../common/enum/reaction.enum";
import { BaseDto } from "../core/base.dto";

export class UserVideoReactionDto extends BaseDto{
    @ApiProperty({ default: 'xyz', required: true })
    @IsNotEmpty()
    videoId: string;
    @ApiProperty({ enum: Reaction, default: Reaction.Neutral, required: true })
    @IsNotEmpty()
    reaction: Reaction
}