import {
  Body,
  Controller,
  Headers,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HandshakeUserDto } from './dto/handshake.user.dto';
import { EncryptedDataDto } from './dto/encrypted.data.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/handshake')
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
    }),
  )
  async handshake(@Body() handshakeUserDto: HandshakeUserDto) {
    return await this.appService.handshake(handshakeUserDto);
  }

  @Post('/auth')
  async auth(
    @Headers() headers: Headers,
    @Body() encryptedDataDto: EncryptedDataDto,
  ) {
    return await this.appService.verifyUser(encryptedDataDto, headers);
  }
}
