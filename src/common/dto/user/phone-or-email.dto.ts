import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PhoneOrEmailDto {
  @ApiProperty()
  @IsString({ message: 'Phone or email must be a string' })
  phoneOrEmail: string;
}
