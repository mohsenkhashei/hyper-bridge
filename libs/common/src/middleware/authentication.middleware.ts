import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from 'apps/hyper-bridge/src/app.service';
import { EncryptedDataDto } from 'apps/hyper-bridge/src/dto/encrypted.data.dto';
import { HeaderKeyDto } from 'apps/hyper-bridge/src/dto/header.key.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly appService: AppService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const requestBody = plainToClass(EncryptedDataDto, req.body);
    const requestBodyError = await validate(requestBody);
    const headerKey = plainToClass(HeaderKeyDto, req.headers);
    const headerKeyError = await validate(headerKey);

    if (requestBodyError.length > 0) {
      this.logger.error(`${AuthenticationMiddleware.name} requestBodyError`);
      throw new UnauthorizedException('The Posted Data Is Not Acceptable');
    }
    if (headerKeyError.length > 0) {
      this.logger.error(`${AuthenticationMiddleware.name} ${headerKeyError}`);
      throw new UnauthorizedException(
        'The key Parameter Not Existed In Header',
      );
    }

    const keyIsValid = await this.appService.checkPublicKeyIsValid(
      headerKey.key,
    );
    if (!keyIsValid) {
      this.logger.error(
        `${AuthenticationMiddleware.name} key is not exist in DB or is not valid.`,
      );
      throw new UnauthorizedException('key is not valid.');
    }

    next();
  }
}
