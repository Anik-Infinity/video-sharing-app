import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags
} from '@nestjs/swagger';
import { UserSearchFilterDto } from '../../../../common/dto/user/model/user.dto';
import { PaginationDecorator } from '../../../../common/decorator/pagination.decorator';
import { PaginationDTO } from '../../../../common/dto/pagination/pagination.dto';
import { ResponseDto } from '../../../../common/dto/reponse/response.dto';
import { CreateStudentDto } from '../../../../common/dto/user/create-student.dto';
import { OtpDto } from '../../../../common/dto/user/otp.dto';
import { DtoValidationPipe } from '../../../../common/pipes/dto-validation.pipe';
import { UuidValidationPipe } from '../../../../common/pipes/uuid-validation.pipe';
import { ResponseService } from '../../../../common/services/response.service';
import { UserService } from '../service/user.service';
import { CreateUserBaseDto } from '../../../../common/dto/user/create-user-base.dto';
import { UserResponseDto } from 'src/common/dto/reponse/user-response.dto';
@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly responseService: ResponseService,
    ) {}

    @ApiBody({ type: CreateStudentDto })
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        description: 'Verify your OTP first',
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('student-registration')
    createStudent(
        @Body(
            new DtoValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        )
        createStudentDto: CreateStudentDto,
    ): Promise<ResponseDto> {
        const studentDto = this.userService.createStudent(createStudentDto);
        return this.responseService.toDtoResponse(
            HttpStatus.CREATED,
            'Verify your OTP first',
            studentDto,
        );
    }

    @ApiBody({ type: CreateUserBaseDto })
    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        description: 'User Registration Successful',
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('user-registration')
    createUser(
        @Body(
            new DtoValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        )
        createUserDto: CreateUserBaseDto,
    ) {
        const userDto = this.userService.createUser(createUserDto);
        return this.responseService.toResponse<UserResponseDto>(
            HttpStatus.OK,
            'User Registration Successful',
            userDto,
        );
    }


    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'get the single user data.',
    })
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('find/:id')
    findUserById(
        @Param('id', new UuidValidationPipe()) id: string,
    ): Promise<ResponseDto> {
        const user = this.userService.findUserById(id);
        return this.responseService.toDtoResponse(
            HttpStatus.OK,
            'single user data.',
            user,
        );
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'user pagination list',
    })
    @HttpCode(HttpStatus.OK)
    @Get('pagination')
    pagination(
        @PaginationDecorator() pagination: PaginationDTO,
        @Query() userSearchFilter: UserSearchFilterDto,
    ): Promise<ResponseDto> {
        const users = this.userService.pagination(
            pagination.page,
            pagination.limit,
            pagination.sort,
            pagination.order === 'ASC' ? 'ASC' : 'DESC',
            userSearchFilter,
        );
        return this.responseService.toPaginationResponse(
            HttpStatus.OK,
            'user pagination list',
            pagination.page,
            pagination.limit,
            users,
        );
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'get the list of all user.',
    })
    @HttpCode(HttpStatus.OK)
    @Get('list')
    findAll(): Promise<ResponseDto> {
        const users = this.userService.findAll();
        return this.responseService.toDtosResponse(
            HttpStatus.OK,
            'list of all user',
            users,
        );
    }

    @ApiBody({ type: OtpDto })
    @ApiOkResponse({
        status: HttpStatus.CREATED,
        description: 'Otp verified Successfully',
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('verify-otp/:id')
    verifyOtp(
        @Param('id', new UuidValidationPipe()) id: string,
        @Body() otp: OtpDto,
    ): Promise<ResponseDto> {
        const userOtp = this.userService.verifyOtp(id, otp);
        return this.responseService.toResponse(
            HttpStatus.CREATED,
            'Otp verified Successfully',
            userOtp,
        );
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Otp resend api',
    })
    @HttpCode(HttpStatus.OK)
    @Post('resend-otp/:id')
    resendOtp(@Param('id', new UuidValidationPipe()) id: string): Promise<any> {
        const user = this.userService.resendOtp(id);
        return this.responseService.toDtoResponse(
            HttpStatus.CREATED,
            'OTP Resend. Verify your OTP first',
            user,
        );
    }
}
