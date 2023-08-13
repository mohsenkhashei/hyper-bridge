import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { HandshakeUserDto } from './dto/handshake.user.dto';
import { EncryptedDataDto } from './dto/encrypted.data.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/handshake')
  async handshake(@Body() handshakeUserDto: HandshakeUserDto) {
    return await this.appService.handshake(handshakeUserDto);
  }

  @Post('/auth')
  async auth(
    @Headers() headers: Headers,
    @Body() encryptedDataDto: EncryptedDataDto,
  ) {
    return await this.appService.validateUser(encryptedDataDto, headers);
  }
}
