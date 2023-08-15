import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const DevicesSchema = SchemaFactory.createForClass(DevicesDocument);
