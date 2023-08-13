import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { RequestService } from 'src/request.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    // private readonly requestService: RequestService
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(AuthenticationMiddleware.name);

    const userId = '124';
    // this.requestService.setUserId(userId);

    next();
  }
}
