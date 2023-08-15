import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DevicesDocument } from './devices.schema';
import mongoose from 'mongoose';

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

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Devices' }] })
  devices: DevicesDocument[];
}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument);
