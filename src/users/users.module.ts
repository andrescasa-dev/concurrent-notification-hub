import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USERS_REPOSITORY } from './constants/injection-tokens';
import { User } from './entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { UsersTypeOrmRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersTypeOrmRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
