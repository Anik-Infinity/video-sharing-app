import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty()
    @IsString({ message: 'old password must be a string' })
    presentPassword: string;

    @ApiProperty()
    @IsString({ message: 'new password must be a string' })
    newPassword: string;

    @ApiProperty()
    @IsString({ message: 'confirm password must be a string' })
    confirmPassword: string;

    // @ApiProperty()
    // @IsOptional()
    // @IsString({ message: 'token must be a string' })
    // token: string;
}
