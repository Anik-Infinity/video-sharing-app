import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class OtpDto {
  @ApiProperty()
  @IsOptional()
  @IsInt({ message: 'Otp must be a string' })
  otp: number;
}
