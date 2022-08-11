import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength
} from 'class-validator';
import { Gender } from '../../../../common/enum/gender.enum';
import { RoleType } from '../../../enum/role-type.enum';
import { BaseDto } from '../../core/base.dto';
import { ApiQueryPaginationBaseDTO } from '../../pagination/api-query-pagination-base.dto';
import { AdminDto } from './admin.dto';
import { LibrarianDto } from './librarian.dto';
import { StudentDto } from './student.dto';

export class UserDto extends BaseDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(65)
    fullName: string;
 
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(100)
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone: string;

    @IsOptional()
    @IsDateString({ strict: true })
    dateOfBirth: Date | null;

    @IsOptional()
    @IsEnum(Gender, { message: 'Must be a valid gender [1-3]' })
    gender: Gender;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    currentAddress: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    permanentAddress: string;

    @IsString()
    @MaxLength(200)
    userImageUrl: string;

    @IsOptional()
    @IsEnum(RoleType, { message: 'Must be a valid gender [1-5]' })
    roleType: RoleType;

    @Type(() => StudentDto)
    student: StudentDto;

    @Type(() => LibrarianDto)
    librarian: LibrarianDto;

    @Type(() => AdminDto)
    admin: LibrarianDto;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    password: string;

    @IsOptional()
    @IsDateString({ strict: true })
    lastPasswdChngAt: Date;

    @IsOptional()
    @IsInt()
    otp: number;

    @IsOptional()
    @IsString()
    @MaxLength(40)
    resetPasswordToken: string;

    @IsOptional()
    @IsDateString({ strict: true })
    resetPasswordValidity: Date;
}

export class UserSearchFilterDto extends ApiQueryPaginationBaseDTO {
    @ApiProperty({
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString() 
    email: string;

    @ApiProperty({
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    fromDate: string;

    @ApiProperty({
        required: false,
        type: String,
    })
    @IsOptional()
    @IsString()
    toDate: string;
}
