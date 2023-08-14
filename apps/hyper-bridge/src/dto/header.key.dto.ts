import { IsNotEmpty, IsString } from 'class-validator';

export class HeaderKeyDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
