import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CustomBaseEntity } from "../core/custom-base.entity";
import { UserEntity } from "../user/user.entity";

@Entity({name: 'videos', schema: 'public'})
export class VideoEntity extends CustomBaseEntity {

    @Column({name: 'video_url', type: 'varchar', nullable: true})
    videoUrl: string;

    @Column({name: 'video_title', type: 'varchar', nullable: true})
    videoTitle: string;

    @Column({name: 'video_id', type: 'varchar', nullable: true})
    videoId: string;

    @Column({ name: 'like_count', type: 'int', default: 0, nullable: true})
    likeCount: number;

    @Column({ name: 'dislike_count', type: 'int', default: 0, nullable: true})
    disLikeCount: number;

    @Column({ name: 'view_count', type: 'int', default: 0, nullable: true})
    viewCount: number;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.video)
    @JoinColumn({name: "user_id"})
    user: UserEntity;
}