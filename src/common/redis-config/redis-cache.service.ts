import { Injectable, Inject, CACHE_MANAGER, Global } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Global()
@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async get(key: string) {
        await this.cache.get(key);
    }

    async set(key: string, value: any) {
        await this.cache.set(key, value, { ttl: 3600 });
    }
}
