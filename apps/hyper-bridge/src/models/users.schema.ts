import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class UsersDocument extends AbstractDocument {
  @Prop()
  customerNo: number;

  @Prop()
  password: string;

  @Prop()
  preferences?: string;

  @Prop()
  devices?: string[];
}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument);
