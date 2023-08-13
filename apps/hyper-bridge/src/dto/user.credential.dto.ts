import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserCredentialDto {
  @IsNumber()
  @IsNotEmpty()
  customerNo: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
