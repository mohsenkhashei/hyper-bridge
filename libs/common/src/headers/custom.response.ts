import { Response } from 'express';

export class CustomResponse {
  private readonly response: Response;

  constructor(response: Response) {
    this.response = response;
    this.setDefaultHeaders();
  }

  private setDefaultHeaders(): void {
    this.setContentType('application/json');
    this.setCacheControl('no-cache, no-store, must-revalidate');
  }

  setContentType(type: string): CustomResponse {
    this.response.setHeader('Content-Type', type);
    return this;
  }

  setCacheControl(value: string): CustomResponse {
    this.response.setHeader('Cache-Control', value);
    return this;
  }

  setCustomHeader(key: string, value: string): CustomResponse {
    this.response.setHeader(key, value);
    return this;
  }

  send(data: any): void {
    this.response.send(data);
  }
}
