import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoggerModule } from '@app/common/logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}