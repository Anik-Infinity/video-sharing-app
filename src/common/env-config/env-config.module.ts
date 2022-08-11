import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env['NODE_ENV'];
const envFilePath = [`${!ENV ? `.env` : `.env.${ENV}`}`];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
  ],
})
export class EnvConfigModule {}
