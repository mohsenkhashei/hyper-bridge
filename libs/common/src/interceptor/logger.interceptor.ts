import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService, // private readonly requestService: RequestService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;
    this.logger.log(
      `Headers: ${JSON.stringify(request.headers)} |
        Body: ${JSON.stringify(request.body)}
    |  ${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    );
    // this.logger.warn(`userId: ${this.requestService.getUserId()}`);

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        const response = context.switchToHttp().getResponse();
        this.logger.log(`##### ${JSON.stringify(res)} #####`);
        const { statusCode } = response;
        const contentLength = response.get('content-length');

        this.logger.log(`
       Response Headers: ${JSON.stringify(response.headers)} | 
          ${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}: ${
          Date.now() - now
        }ms
        `);
      }),
    );
  }
}
