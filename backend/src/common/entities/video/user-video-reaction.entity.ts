import { Reaction } from '../../../common/enum/reaction.enum';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { VideoEntity } from './video.entity';
import { CustomBaseEntity } from '../core/custom-base.entity';

@Entity({ name: 'user-video-reaction', schema: 'public' })
export class UserVideoReactionEntity extends CustomBaseEntity {
   @ManyToOne(() => UserEntity, (userEntity) => userEntity.userVideoReaction)
   @JoinColumn({ name: 'user_id' })
   user: UserEntity;

   @ManyToOne(() => VideoEntity, (videoEntity) => videoEntity.userVideoReaction)
   @JoinColumn({ name: 'video_id' })
   video: VideoEntity;

   @Column({
      type: 'enum',
      name: 'reaction',
      enum: Reaction,
      default: `${Reaction.Neutral}`,
   })
   reaction: Reaction;
}
