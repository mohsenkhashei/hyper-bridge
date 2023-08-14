import { IsNotEmpty, IsString } from 'class-validator';

export class EncryptedDataDto {
  @IsString()
  @IsNotEmpty()
  data: string;
}
