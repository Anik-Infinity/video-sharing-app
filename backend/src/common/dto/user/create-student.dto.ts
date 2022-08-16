import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateUserBaseDto } from './create-user-base.dto';

export class CreateStudentDto extends CreateUserBaseDto {
    @ApiProperty({
        description: 'user student id',
        default: '16151001',
        required: true,
    })
    @IsString()
    @MaxLength(50)
    studentId: string;

    @ApiPropertyOptional({
        description: 'student deparment',
        default: 'Computer Science and Engineering',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    department: string;
}
