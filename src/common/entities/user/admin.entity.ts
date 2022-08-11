import { RoleName } from '../../../common/enum/role-name.enum';
import { Column, Entity, OneToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'admins', schema: 'public' })
export class AdminEntity extends CustomBaseEntity {

  @Column({
    type: 'enum',
    name: 'role_name',
    enum: RoleName,
  })
  roleName: RoleName;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.admin)
  user: UserEntity;
}
