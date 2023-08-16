import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes } from 'mongoose';
import { UsersDocument } from './users.schema';

@Schema({ versionKey: false, collection: 'devices' })
export class DevicesDocument extends AbstractDocument {
  @Prop()
  deviceId: string;

  @Prop()
  name: string;

  @Prop()
  serverPublicKey?: string;

  @Prop()
  publicKey: string;

  @Prop()
  preferences?: string[];

  @Prop({
    type: {
      email: Boolean,
      sms: Boolean,
    },
    default: {
      email: false,
      sms: false,
    },
  })
  notifications?: {
    email: boolean;
    sms: boolean;
  };

  @Prop({ type: SchemaTypes.ObjectId, ref: 'UsersDocument' }) // Reference to UsersSchema
  user?: UsersDocument;
}

export const DevicesSchema = SchemaFactory.createForClass(DevicesDocument);
export const Devices = mongoose.model('Devices', DevicesSchema);
