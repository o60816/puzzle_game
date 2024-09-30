import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MessageModule } from './api/message/message.module';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { DatabaseModule } from './model/database.module';
import { UsersModule } from './api/users/users.module';
import logger from './utils/logger';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    MessageModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/frontend/build'),
    }),
  ],
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
