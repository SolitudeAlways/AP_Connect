import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });
console.log('POSTGRES_PASSWORD:', JSON.stringify(process.env.POSTGRES_PASSWORD));

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // на проде лучше отключить и миграции использовать
      autoLoadEntities: true,
    }),
    UserModule,
    ChatModule,
  ],
})
export class AppModule {}
