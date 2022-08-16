import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseService } from '../../../common/services/response.service';
import { BcryptService } from '../../../common/services/bcrypt.service';
import { ExceptionService } from '../../../common/services/exception.service';
import { UserModule } from '../user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
    imports: [HttpModule, UserModule],
    exports: [AuthService],
    providers: [
        AuthService,
        BcryptService,
        ExceptionService,
        ResponseService,
        ConfigService,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
