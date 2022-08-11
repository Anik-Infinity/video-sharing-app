import { Column, Entity, Index, OneToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'students', schema: 'public' })
@Index('students-student_id-isactive-idx', ['studentId', 'isActive'])
export class StudentEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'student_id', length: 50, nullable: true })
  @Index('students-student_id-idx', { unique: true })
  studentId: string;

  @Column({ type: 'varchar', name: 'department', length: 60, nullable: true })
  department: string;

  @OneToOne(() => UserEntity, (user) => user.student)
  user: UserEntity;
}
