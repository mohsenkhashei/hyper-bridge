import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Devices, DevicesDocument, DevicesSchema } from './devices.schema';
import mongoose, { SchemaTypes } from 'mongoose';

@Schema({ versionKey: false, collection: 'users' })
export class UsersDocument extends AbstractDocument {
  @Prop()
  customerNo: number;

  @Prop()
  password: string;

  @Prop()
  userId: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: number;

  @Prop()
  address: string;

  @Prop()
  imageUrl: string;

  @Prop()
  passportNo: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'DevicesDocument' }] })
  devices?: DevicesDocument[];
}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument);
export const Users = mongoose.model('Users', UsersSchema);
