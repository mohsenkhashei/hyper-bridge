import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum COMMUNICATION_TYPE {
  JSON = 'JSON',
  HASH = 'HASH',
  KEY = 'KEY',
}
export class ResponseFormatDto {
  responseType: COMMUNICATION_TYPE;
  data: string | object;
}

export class RequestFormatDto {
  @IsNotEmpty()
  @IsEnum(COMMUNICATION_TYPE)
  requestType: COMMUNICATION_TYPE;

  @IsNotEmpty()
  @IsString()
  data: string | object;
}
