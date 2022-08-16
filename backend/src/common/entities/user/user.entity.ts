import { Exclude } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Gender } from '../../../common/enum/gender.enum';
import { RoleType } from '../../../common/enum/role-type.enum';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { UserVideoReactionEntity } from '../video/user-video-reaction.entity';
import { VideoEntity } from '../video/video.entity';
import { AdminEntity } from './admin.entity';
import { StudentEntity } from './student.entity';

@Entity({ name: 'users', schema: 'public' })
@Index('users-email-isactive-idx', ['email', 'isActive'])
@Index('users-phone-isactive-idx', ['phone', 'isActive'])
export class UserEntity extends CustomBaseEntity {
    @Column({ type: 'varchar', name: 'full_name', length: 65 })
    fullName: string;

    @Column({ type: 'varchar', name: 'email', length: 100, nullable: true })
    @Index('users-email-idx', { unique: true })
    email: string;

    @Column({ type: 'varchar', name: 'phone', length: 20, nullable: true })
    @Index('users-phone-idx', { unique: true })
    phone: string;

    @Column({
        type: 'date',
        name: 'date_of_birth',
        nullable: true,
    })
    dateOfBirth: Date | null;

    @Column({
        type: 'enum',
        name: 'gender',
        enum: Gender,
        default: `${Gender.Unknown}`,
    })
    gender: Gender;

    @Column({ type: 'varchar', name: 'current_address', length: 100 })
    currentAddress: string;

    @Column({ type: 'varchar', name: 'permanent_address', length: 100 })
    permanentAddress: string;

    @Column({
        type: 'varchar',
        name: 'user_image_url',
        length: 255,
        nullable: true,
    })
    userImageUrl: string;

    @OneToOne(() => StudentEntity, (student) => student.user, { cascade: true })
    @JoinColumn({ name: 'student_id' })
    student: StudentEntity;


    @OneToOne(() => AdminEntity, (admin) => admin.user, { cascade: true })
    @JoinColumn({ name: 'admin_id' })
    admin: AdminEntity;

    @OneToMany(() => VideoEntity, (videoEntity) => videoEntity.user)
    video: VideoEntity[]

    @OneToMany(() => UserVideoReactionEntity, (userVideoReaction) => userVideoReaction.user)
    userVideoReaction: UserVideoReactionEntity[]

    @Column({
        type: 'enum',
        name: 'roll_type',
        enum: RoleType,
        default: `${RoleType.STUDENT}`,
    })
    roleType: RoleType;

    @Exclude()
    @Column({ type: 'varchar', name: 'password', length: 100, nullable: false })
    password: string;

    @Exclude()
    @Column({
        type: 'timestamp',
        name: 'last_passwd_chng_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    lastPasswdChngAt: Date;

    @Column({ type: 'int', name: 'otp', nullable: true })
    otp: number;

    @Exclude()
    @Column({
        type: 'varchar',
        name: 'reset_password_token',
        length: 40,
        nullable: true,
    })
    resetPasswordToken: string;

    @Exclude()
    @Column({
        type: 'timestamp',
        name: 'reset_password_validity',
        nullable: true,
    })
    resetPasswordValidity: Date;
}
