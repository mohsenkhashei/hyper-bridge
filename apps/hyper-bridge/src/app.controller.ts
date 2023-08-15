import {
  Body,
  Controller,
  Headers,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDeviceDto } from './dto/register.device';
import {
  COMMUNICATION_TYPE,
  RequestFormatDto,
} from './dto/data.format.type.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
    }),
  )
  async register(@Body() registerDeviceDto: RegisterDeviceDto) {
    return await this.appService.register(registerDeviceDto);
  }

  @Post('/auth')
  async auth(
    @Headers() headers: Headers,
    @Body() requestFormatDto: RequestFormatDto,
  ) {
    if (requestFormatDto.requestType == COMMUNICATION_TYPE.HASH) {
      return await this.appService.authenticateCustomer(
        requestFormatDto,
        headers,
      );
    }
  }

  // @Put('/auth/update/:userId')
  // async update() {}
}
