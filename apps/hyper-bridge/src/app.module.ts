import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Scope,
} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@app/common/logger/logger.module';
import { AuthenticationMiddleware } from '@app/common/middleware/authentication.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@app/common/interceptor/logger.interceptor';
import { ConfigModule } from '@app/common/config/config.module';
import { EncryptionModule } from '@app/common/encryption/encryption.module';
import { AppRepository } from './app.repository';
import { DatabaseModule } from '@app/common/database/database.module';
import { UsersDocument, UsersSchema } from './models/users.schema';
import { InitializationService } from './initialization.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    EncryptionModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UsersDocument.name, schema: UsersSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: LoggingInterceptor,
    },
    AppService,
    AppRepository,
    InitializationService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: '/handshake', method: RequestMethod.POST })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
