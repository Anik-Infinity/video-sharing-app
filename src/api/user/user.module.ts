import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../common/entities/user/user.entity';
import { BcryptService } from '../../common/services/bcrypt.service';
import { ConversionService } from '../../common/services/conversion.service';
import { ExceptionService } from '../../common/services/exception.service';
import { PermissionService } from '../../common/services/permission.service';
import { RequestService } from '../../common/services/request.service';
import { ResponseService } from '../../common/services/response.service';
import { UserController } from './user/controller/user.controller';
import { UserService } from './user/service/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    exports: [UserService],
    providers: [
        UserService,
        ResponseService,
        ConversionService,
        BcryptService,
        ExceptionService,
        PermissionService,
        RequestService,
    ],
})
export class UserModule {}
