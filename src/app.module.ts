import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MessageModule } from './api/message/message.module';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { DatabaseModule } from './model/database.module';
import logger from './utils/logger';

@Module({
  imports: [DatabaseModule, MessageModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger.expressMiddleware()).forRoutes('*');
  }
}
