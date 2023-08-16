import {
  Body,
  Controller,
  Headers,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDeviceDto } from './dto/register.device';
import {
  COMMUNICATION_TYPE,
  RequestFormatDto,
  ResponseFormatDto,
} from './dto/data.format.type.dto';
import { Response } from 'express';
import { CustomResponse } from '@app/common/headers/custom.response';

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
    @Res() res: Response,
  ) {
    if (requestFormatDto.requestType == COMMUNICATION_TYPE.HASH) {
      const result = await this.appService.authenticateCustomer(
        requestFormatDto,
        headers,
      );
      const deviceId = result.deviceId;
      delete result.deviceId;
      const customResponse = new CustomResponse(res);
      customResponse.setCustomHeader('X-DEVICE-ID', deviceId).send(result);
    } else {
      return {
        responseType: COMMUNICATION_TYPE.JSON,
        data: 'without encryption communication of this method does not implemented yet',
      };
    }
  }
}
