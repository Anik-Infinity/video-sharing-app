import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../../../../common/dto/reponse/response.dto';
import { UserResponseDto } from '../../../../common/dto/reponse/user-response.dto';
import { ChangePasswordDto } from '../../../../common/dto/user/change-password.dto';
import { LoginDto } from '../../../../common/dto/user/login.dto';
import { UserDto } from '../../../../common/dto/user/model/user.dto';
import { PhoneOrEmailDto } from '../../../../common/dto/user/phone-or-email.dto';
import { ResetPasswordDto } from '../../../../common/dto/user/reset-password.dto';
import { DtoValidationPipe } from '../../../../common/pipes/dto-validation.pipe';
import { ResponseService } from '../../../../common/services/response.service';
import { AuthService } from '../services/auth.service';
@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly responseService: ResponseService,
    ) {}

    @ApiCreatedResponse({
        status: HttpStatus.OK,
        description: 'Login is successful',
    })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body(
            new DtoValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        )
        loginDto: LoginDto,
    ) {
        const payload = this.authService.login(loginDto);
        return this.responseService.toResponse<UserResponseDto>(
            HttpStatus.OK,
            'Login is successful',
            payload,
        );
    }

    @ApiCreatedResponse({
        status: HttpStatus.OK,
        description: 'Email is sent with password changed url',
    })
    @HttpCode(HttpStatus.OK)
    @Post('forget-password')
    async forgetPassword(
        @Body(
            new DtoValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        )
        phoneOrEmailDto: PhoneOrEmailDto,
    ): Promise<any> {
        return Promise.resolve('Forget Password API under construction');
    }

    @ApiCreatedResponse({
        status: HttpStatus.OK,
        description: 'User Password Changing API!',
    })
    @HttpCode(HttpStatus.OK)
    @Post('change-password')
    async changePassword(
        @Body(
            new DtoValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        )
        changePasswordDto: ChangePasswordDto,
    ): Promise<ResponseDto> {
        const payload = this.authService.changePassword(changePasswordDto);
        return this.responseService.toResponse<UserDto>(
            HttpStatus.OK,
            'Password is changed successfully!! You can login now!',
            payload,
        );
    }

    @ApiCreatedResponse({
        status: HttpStatus.OK,
        description: 'Password is re-set successfully!! You can login now!',
    })
    @HttpCode(HttpStatus.OK)
    @Post('reset-password')
    async resetPassword(
        @Body(
            new DtoValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        )
        resetPasswordDto: ResetPasswordDto,
    ): Promise<any> {
        return Promise.resolve('Reset Password API under construction');
    }
}
