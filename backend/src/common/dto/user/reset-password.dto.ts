import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty()
    @IsString({ message: 'new password must be a string' })
    newPassword: string;

    @ApiProperty()
    @IsString({ message: 'confirm password must be a string' })
    confirmPassword: string;

    @ApiProperty()
    @IsString({ message: 'token must be a string' })
    token: string;
}
