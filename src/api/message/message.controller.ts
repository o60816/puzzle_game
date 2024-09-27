import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { WebhookRequestBody } from '@line/bot-sdk';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  login(@Body() body: WebhookRequestBody) {
    return this.messageService.dispatchMessage(body);
  }
}
