import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { userProviders } from 'src/model/repositories/users/users.providers';
import { DatabaseModule } from 'src/model/database.module';
import { MessageService } from './message.service';
import { problemProviders } from 'src/model/repositories/problems/problems.providers';

@Module({
  controllers: [MessageController],
  providers: [MessageService, ...userProviders, ...problemProviders],
  imports: [DatabaseModule],
})
export class MessageModule {}
