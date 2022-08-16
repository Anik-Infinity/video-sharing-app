import { CacheModule, Global, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts as RedisClientOpts } from 'redis';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
    imports: [
        CacheModule.register<RedisClientOpts>({
            isGlobal: true,
            store: redisStore,
            host: 'localhost',
            port: 6379,
            db: 5,
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService],
})
export class RedisCacheModule {}
