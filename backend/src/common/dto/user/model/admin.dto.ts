import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsString, MaxLength } from 'class-validator';
import { RoleName } from '../../../../common/enum/role-name.enum';
import { BaseDto } from '../../core/base.dto';
import { UserDto } from './user.dto';

export class AdminDto extends BaseDto {
  @IsEnum(RoleName)
  roleName: RoleName;

  @Type(() => UserDto)
  user: UserDto;
}
