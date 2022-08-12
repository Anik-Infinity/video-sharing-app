import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from '../../../../common/dto/user/change-password.dto';
import { CreateStudentDto } from '../../../../common/dto/user/create-student.dto';
import { StudentDto } from '../../../../common/dto/user/model/student.dto';
import { UserDto, UserSearchFilterDto } from '../../../../common/dto/user/model/user.dto';
import { OtpDto } from '../../../../common/dto/user/otp.dto';
import { UserEntity } from '../../../../common/entities/user/user.entity';
import { ActiveStatus } from '../../../../common/enum/active.enum';
import { RoleType } from '../../../../common/enum/role-type.enum';
import { SystemException } from '../../../../common/exceptions/system.exception';
import { isActive } from '../../../../common/queries/is-active.query';
import { BcryptService } from '../../../../common/services/bcrypt.service';
import { ConversionService } from '../../../../common/services/conversion.service';
import { ExceptionService } from '../../../../common/services/exception.service';
import { PermissionService } from '../../../../common/services/permission.service';
import { RequestService } from '../../../../common/services/request.service';
import { Repository } from 'typeorm';
import { CreateUserBaseDto } from '../../../../common/dto/user/create-user-base.dto';
import { UserResponseDto } from '../../../../common/dto/reponse/user-response.dto';
import { RoleName } from '../../../../common/enum/role-name.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly conversionService: ConversionService,
        private readonly bcryptService: BcryptService,
        private readonly exceptionService: ExceptionService,
        private readonly permissionService: PermissionService,
        private readonly requestService: RequestService,
    ) {}

    createStudent = async (
        createStudentDto: CreateStudentDto,
    ): Promise<UserDto> => {
        try {
            const userDto: UserDto = await this.setUserData(createStudentDto);
            userDto.student = new StudentDto();
            userDto.student.studentId = createStudentDto.studentId;
            userDto.student.department = createStudentDto.department;
            userDto.student.createdAt = new Date();
            userDto.student.updatedAt = new Date();
            userDto.roleType = RoleType.STUDENT;

            const studentCreated = this.userRepository.create(userDto);
            const studentSave = await this.userRepository.save(studentCreated);

            return this.conversionService.toDto<UserEntity, UserDto>(
                studentSave,
            );
        } catch (error) {
            throw new SystemException(error);
        }
    };

    createUser = async (
        createUserDto: CreateUserBaseDto,
    ): Promise<UserResponseDto> => {
        try {
            const userDto: UserDto = await this.setUserData(createUserDto);
            userDto.roleType = RoleType.GENERAL_USER;
            const userCreated = this.userRepository.create(userDto);
            const userSave = await this.userRepository.save(userCreated);
            const user = await this.conversionService.toDto<UserEntity, UserDto>(
                userSave,
            );
            return this.generatePayload(user);
        } catch (error) {
            throw new SystemException(error);
        }
    };


    findOneByEmailOrPhone = async (emailOrPhone: string): Promise<UserDto> => {
        try {
            const query = this.userRepository.createQueryBuilder('user');

            const user = await query
                .where(
                    '(user.phone = :phone OR user.email = :email) AND user.isActive = :isActive',
                    {
                        phone: emailOrPhone,
                        email: emailOrPhone,
                        ...isActive,
                    },
                )
                .leftJoinAndSelect('user.admin', 'admin')
                .leftJoinAndSelect('user.student', 'student')
                .getOne();

            this.exceptionService.notFound(
                user,
                'User is not found by either phone or email!',
            );

            return this.conversionService.toDto<UserEntity, UserDto>(user);
        } catch (error) {
            throw new SystemException(error);
        }
    };

    findUserById = async (id: string): Promise<UserEntity> => {
        try {
            const user = await this.userRepository.findOne({
                where: { id, ...isActive },
            });

            if (!user) {
                throw new Error('user not found!');
            }

            const query = this.userRepository
                .createQueryBuilder('user')
                .where('user.id = :id', { id: id });

            switch (user.roleType) {
                case RoleType.ADMIN:
                    query.leftJoinAndSelect('user.admin', 'admin');
                    break;
                case RoleType.STUDENT:
                    query.leftJoinAndSelect('user.student', 'student');
                    break;
            }

            const userWithRoleDetail = query.getOne();

            return Promise.resolve(userWithRoleDetail);
        } catch (error) {
            throw new SystemException(error);
        }
    };

    pagination = async (
        page: number,
        limit: number,
        sort: string,
        order: 'ASC' | 'DESC',
        userSearchFilter: UserSearchFilterDto,
    ): Promise<[UserDto[], number]> => {
        try {
            const query = await this.userRepository
                .createQueryBuilder('user')
                .where('user.isActive = :isActive', { ...isActive });

            if (userSearchFilter.name) {
                query.andWhere('lower(user.fullName) like :name', {
                    name: `%${userSearchFilter.name.toLowerCase()}%`,
                });
            }

            if (userSearchFilter.phone) {
                query.andWhere('lower(user.phone) like :phone', {
                    phone: `%${userSearchFilter.phone.toLowerCase()}%`,
                });
            }

            if (userSearchFilter.email) {
                query.andWhere('lower(user.email) like :email', {
                    email: `%${userSearchFilter.email.toLowerCase()}%`,
                });
            }

            if (userSearchFilter.fromDate) {
                query.andWhere('DATE(user.createdAt) >=  :startDate', {
                    startDate: userSearchFilter.fromDate,
                });
            }

            if (userSearchFilter.toDate) {
                query.andWhere('DATE(user.createdAt) <= :endDate', {
                    endDate: userSearchFilter.toDate,
                });
            }

            sort === 'createdAt'
                ? (sort = 'user.createdAt')
                : (sort = 'user.updatedAt');

            query
                .orderBy(sort, order)
                .skip((page - 1) * limit)
                .take(limit);

            const bookData = await query.getManyAndCount();

            return this.conversionService.toPagination<UserEntity, UserDto>(
                bookData,
            );
        } catch (error) {
            throw new SystemException(error);
        }
    };

    findAll = async (): Promise<UserDto[]> => {
        try {
            const allUser = await this.userRepository.find({
                where: { ...isActive },
            });
            return this.conversionService.toDtos<UserEntity, UserDto>(allUser);
        } catch (error) {
            throw new SystemException(error);
        }
    };

    updatePassword = async (
        changePasswordDto: ChangePasswordDto,
    ): Promise<UserDto> => {
        try {
            const id = this.permissionService.returnRequest().userId;

            const savedUser = await this.userRepository.findOne({
                where: { id, ...isActive },
            });

            this.exceptionService.notFound(savedUser, 'User is not found');

            const matchPassword = await this.bcryptService.comparePassword(
                changePasswordDto.presentPassword,
                savedUser.password,
            );

            if (!matchPassword) {
                throw new SystemException('Please enter correct password!');
            }

            savedUser.password = await this.bcryptService.hashPassword(
                changePasswordDto.newPassword,
            );

            const modifiedSavedUser =
                this.requestService.forUpdateEntity(savedUser);

            const updatedUser = await this.userRepository.save(
                {
                    ...modifiedSavedUser,
                },
                {
                    reload: true,
                },
            );

            return this.conversionService.toDto<UserEntity, UserDto>(
                updatedUser,
            );
        } catch (error) {
            throw new SystemException(error);
        }
    };

    verifyOtp = async (id: string, otp: OtpDto): Promise<UserDto> => {
        const user = await this.userRepository.findOne({ id, ...otp });
        this.exceptionService.notFound(user, 'Otp mismatched! Resend.');
        user.isActive = 1;
        user.otp = null;
        await this.userRepository.save(user);

        return this.conversionService.toDto<UserEntity, UserDto>(user);
    };

    resendOtp = async (userId: string) => {
        const user = await this.userRepository.findOne(userId);
        this.exceptionService.notFound(user, 'User not found!');
        return user;
    };

    setUserData = async (
        userData: CreateStudentDto | CreateUserBaseDto,
    ): Promise<UserDto> => {
        const userDto: UserDto = new UserDto();
        userDto.fullName = userData?.fullName;
        userDto.email = userData?.email;
        userDto.phone = userData?.phone;
        userDto.password = await this.bcryptService.hashPassword(
            userData?.password,
        );
        userDto.dateOfBirth = userData?.dateOfBirth;
        userDto.gender = userData?.gender;
        userDto.currentAddress = userData?.currentAddress;
        userDto.permanentAddress = userData?.permanentAddress;
        userDto.userImageUrl = userData?.userImageUrl;
        userDto.createdAt = new Date();
        userDto.updatedAt = new Date();
        userDto.isActive = ActiveStatus.ENABLED;
        userDto.otp = this.otpGenerator();

        return Promise.resolve(userDto);
    };

    otpGenerator = (): number => {
        const max = 99999;
        const min = 10001;
        const generate = Math.random() * (max - min) + min;
        return Math.round(generate);
    };

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
}
