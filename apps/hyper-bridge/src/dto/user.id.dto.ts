import { IsNotEmpty, IsUUID } from 'class-validator';
export class UserIdDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
