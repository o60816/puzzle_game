import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { userProviders } from 'src/model/repositories/users/users.providers';
import { DatabaseModule } from 'src/model/database.module';
import { MessageService } from './message.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, ...userProviders],
  imports: [DatabaseModule],
})
export class MessageModule {}
