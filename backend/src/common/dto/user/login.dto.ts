import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator';
import { Bool } from '../../enum/bool.enum';

export class LoginDto {
  @ApiProperty({ default: '01712000001' })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone: string;

  @ApiProperty({default: 'admin@simeclibrary.com'})
  @IsOptional()
  @IsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty({ default: '1234' })
  @IsDefined({ message: 'Password must be defined' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(4)
  password: string;

  @ApiProperty({default: 1})
  @IsInt({ message: 'Must be an integer value' })
  @IsEnum(Bool, { message: 'Can be either 0 or 1' })
  isChecked: Bool;
}
