import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MaxLength } from 'class-validator';
import { CreateUserBaseDto } from './create-user-base.dto';

export class CreateLibrarianDto extends CreateUserBaseDto {
  @ApiProperty({
    description: 'librarian designation',
    default: 'Senior Librarian',
    required: false,
  })
  @IsString()
  @MaxLength(30)
  designation: string;

  @ApiProperty({
    description: 'librarian joining date',
    default: '2022-01-01',
    required: false,
  })
  @IsDateString()
  joiningDate: Date | null;
}
