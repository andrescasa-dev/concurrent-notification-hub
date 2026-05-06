import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvalidModule } from 'nestjs-envalid';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ENVALID, validators, type Config } from './config/config';
import { createTypeOrmOptions } from './config/typeorm.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    EnvalidModule.forRoot({
      validators,
      useDotenv: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ENVALID],
      useFactory: (env: Config) => createTypeOrmOptions(env),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
