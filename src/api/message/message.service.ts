import { Message } from '@line/bot-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/model/repositories/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<UsersEntity>,
  ) {}
  async dispatchMessage(message: Message) {}
}
