export enum RESTYPE {
  JSON = 'JSON',
  HASH = 'HASH',
  KEY = 'KEY',
}
export class ResponseFormatDto {
  responseType: RESTYPE;
  data: string | object;
}
