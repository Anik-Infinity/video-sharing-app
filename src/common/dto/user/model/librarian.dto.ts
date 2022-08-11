import { Type } from 'class-transformer';
import { IsDateString, IsString, MaxLength } from 'class-validator';
import { BaseDto } from '../../core/base.dto';
import { UserDto } from './user.dto';

export class LibrarianDto extends BaseDto {
  @IsString()
  @MaxLength(50)
  designation: string;

  @IsDateString()
  joiningDate: Date | null;

  @Type(() => UserDto)
  user: UserDto;
}
