import {
  Module,
  Global,
  DynamicModule,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redis from 'redis';
import { RedisClientType } from 'redis';

// Constante para el cliente Redis
export const REDIS_CLIENT = 'REDIS_CLIENT';

// Servicio de caché Redis
@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, { EX: ttl });
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}

// Módulo de caché Redis
@Global()
@Module({})
export class RedisCacheModule {
  static register(): DynamicModule {
    return {
      module: RedisCacheModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: async (configService: ConfigService) => {
            const host = configService.get<string>('redis.host') || 'localhost';
            const port = configService.get<number>('redis.port') || 6379;

            const client = redis.createClient({
              socket: {
                host,
                port,
              },
            });

            await client.connect();
            return client;
          },
          inject: [ConfigService],
        },
        RedisCacheService,
      ],
      exports: [RedisCacheService],
    };
  }
}
