import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from '@line/bot-sdk';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  login(@Body() message: Message) {
    return this.messageService.dispatchMessage(message);
  }
}
