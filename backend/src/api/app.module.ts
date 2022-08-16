import { MiddlewareConsumer, Module } from '@nestjs/common';
import { publicUrls } from './public.url';
import { AuthModule } from './user/auth/auth.module';
import { UserModule } from './user/user.module';
import { configEnvironment } from '../common/env-config/env-config';
import { configTypeorm } from '../common/typeorm-config/typeorm.config';
import { configRedis } from '../common/redis-config/redis.config';
import { ResponseService } from '../common/services/response.service';
import { PublicMiddleware } from '../common/middlewares/public.middleware';
import { VideoModule } from './video/video.module';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';

@Module({
    imports: [
        configEnvironment(),
        configTypeorm(),
        configRedis(),
        UserModule,
        AuthModule,
        VideoModule
    ],
    controllers: [],
    providers: [ResponseService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(PublicMiddleware).forRoutes('*');
        consumer
            .apply(AuthMiddleware)
            .exclude(...publicUrls)
            .forRoutes('*');
    }
}
