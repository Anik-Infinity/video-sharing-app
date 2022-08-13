import { Reaction } from "../../../common/enum/reaction.enum";

export class UserVideoReactionDto {
    userId: string;
    videoId: string;
    reaction: Reaction
}