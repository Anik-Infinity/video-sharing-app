import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from 'class-validator';
import { Gender } from '../../../common/enum/gender.enum';

export class CreateUserBaseDto {
    @ApiProperty({
        description: 'user full name',
        default: 'Md. Shahidullah Al Anik',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(65)
    fullName: string;

    @ApiPropertyOptional({
        description: 'user email address',
        default: 'anik.kafi404@gmail.com',
        required: false,
    })
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(100)
    email: string;

    @ApiProperty({
        description: 'user phone number',
        default: '01835309795',
        required: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone: string;

    @ApiProperty({
        description: 'user password',
        default: '1234',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password: string;

    @ApiProperty({
        description: 'user date of birth',
        default: '2022-01-05',
    })
    @IsNotEmpty()
    @IsDateString({ strict: true })
    dateOfBirth: Date | null;

    @ApiProperty({
        description: 'user gender: male: 1, female: 2, unknown: 3',
        default: `${Gender.Male}`,
    })
    @IsNotEmpty()
    @IsEnum(Gender, { message: 'Must be a valid gender [1-3]' })
    gender: Gender;

    @ApiPropertyOptional({
        description: 'user current address',
        default: 'Sector 12, Uttara, Dhaka, Bangladesh',
    })
    @IsString()
    @MaxLength(100)
    currentAddress: string;

    @ApiPropertyOptional({
        description: 'user permanent address',
        default: 'Rajshahi, Bangladesh',
    })
    @IsString()
    @MaxLength(100)
    permanentAddress: string;

    @ApiPropertyOptional({
        description: 'user image url',
        default: 'user-image-path'
    })
    @IsOptional()
    @IsString()
    userImageUrl: string;
}
