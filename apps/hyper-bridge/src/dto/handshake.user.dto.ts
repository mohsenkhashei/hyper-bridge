import { IsNotEmpty, IsString } from 'class-validator';

export class HandshakeUserDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  prime: string;

  @IsString()
  @IsNotEmpty()
  generator: string;
}
