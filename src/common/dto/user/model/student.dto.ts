import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../../core/base.dto';
import { UserDto } from './user.dto';

export class StudentDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  studentId: string;

  @IsString()
  @MaxLength(50)
  department: string;

  @Type(() => UserDto)
  user: UserDto;
}
