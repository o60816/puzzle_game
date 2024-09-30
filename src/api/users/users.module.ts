import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/model/database.module';
import { userProviders } from 'src/model/repositories/users/users.providers';
import { problemProviders } from 'src/model/repositories/problems/problems.providers';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...userProviders, ...problemProviders],
  imports: [DatabaseModule],
})
export class UsersModule {}
