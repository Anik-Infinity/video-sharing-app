import {
    CACHE_MANAGER,
    HttpStatus,
    Inject,
    Injectable,
    Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import * as jwt from 'jsonwebtoken';
import { UserResponseDto } from '../../../../common/dto/reponse/user-response.dto';
import { ChangePasswordDto } from '../../../../common/dto/user/change-password.dto';
import { LoginDto } from '../../../../common/dto/user/login.dto';
import { UserDto } from '../../../../common/dto/user/model/user.dto';
import { RoleName } from '../../../../common/enum/role-name.enum';
import { RoleType } from '../../../../common/enum/role-type.enum';
import { SystemException } from '../../../../common/exceptions/system.exception';
import { BcryptService } from '../../../../common/services/bcrypt.service';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly bcryptService: BcryptService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    async login(loginDto: LoginDto): Promise<UserResponseDto> {
        try {
            const user: UserDto = await this.validateUser(loginDto);

            const userResponseDto: UserResponseDto = await this.generatePayload(
                user,
            );

            const accessToken: string = await this.generateToken(
                userResponseDto,
                loginDto,
            );

            let expireTime = 0;

            loginDto.isChecked ? (expireTime = 32400) : (expireTime = 1200);

            await this.cache.set(accessToken, userResponseDto, {
                ttl: expireTime,
            });

            userResponseDto.accessToken = accessToken;

            return Promise.resolve(userResponseDto);
        } catch (error) {
            throw new SystemException(error);
        }
    }

    async changePassword(
        changePasswordDto: ChangePasswordDto,
    ): Promise<UserDto> {
        try {
            const user = await this.userService.updatePassword(
                changePasswordDto,
            );
            if (!user) {
                throw new SystemException({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'User phone or email is not correct',
                });
            }

            delete user.password;
            return Promise.resolve(user);
        } catch (error) {
            throw new SystemException(error);
        }
    }

    async validateUser(loginDto: LoginDto): Promise<UserDto> {
        try {
            const user: UserDto = await this.userService.findOneByEmailOrPhone(
                loginDto.phone || loginDto.email,
            );

            const isPasswordMatched = await this.bcryptService.comparePassword(
                loginDto.password,
                user?.password,
            );

            if (!isPasswordMatched) {
                throw new SystemException({
                    status: HttpStatus.BAD_REQUEST,
                    message: 'Invalid Password!',
                });
            }

            return user;
        } catch (error) {
            throw new SystemException(error);
        }
    }

    async generatePayload(userDto: UserDto): Promise<UserResponseDto> {
        const userResponseDto = new UserResponseDto();
        userResponseDto.userId = userDto.id;
        userResponseDto.userName = userDto.fullName;
        userResponseDto.email = userDto?.email;
        userResponseDto.phone = userDto?.phone;
        switch (userDto.roleType) {
            case RoleType.SUPER_ADMIN:
                userResponseDto.isSuperAdmin = true;
                userResponseDto.superAdminId = userDto.admin.id;
                userResponseDto.roleName = RoleName.SUPER_ADMIN_ROLE;
                break;
            case RoleType.ADMIN:
                userResponseDto.isAdmin = true;
                userResponseDto.adminId = userDto.admin.id;
                userResponseDto.roleName = RoleName.ADMIN_ROLE;
                break;
            case RoleType.GENERAL_USER:
                userResponseDto.isGeneralUser = true;
                userResponseDto.generalUserId = userDto.id;
                userResponseDto.roleName = RoleName.GENERAL_USER_ROLE;
                break;
            case RoleType.STUDENT:
                userResponseDto.isStudent = true;
                userResponseDto.studentId = userDto.student.id;
                userResponseDto.roleName = RoleName.STUDENT_ROLE;
                break;
        }
        return Promise.resolve(userResponseDto);
    }

    async generateToken(
        payload: UserResponseDto,
        loginDto: LoginDto,
    ): Promise<string> {
        const privateKEY = this.configService
            .get('PRIVATE_KEY')
            .replace(/\\n/g, '\n');

        let accessToken: string;

        if (loginDto.isChecked === 1) {
            accessToken = jwt.sign({ ...payload }, privateKEY, {
                expiresIn: '365d',
                algorithm: 'RS256',
            });
        } else {
            accessToken = jwt.sign({ ...payload }, privateKEY, {
                expiresIn: '365d',
                algorithm: 'RS256',
            });
        }

        return Promise.resolve(accessToken);
    }
}
