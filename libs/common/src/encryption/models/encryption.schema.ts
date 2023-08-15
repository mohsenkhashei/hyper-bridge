import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractDocument } from '../../database/abstract.schema';

@Schema({ versionKey: false, collection: 'encryptions' })
export class EncryptionDocument extends AbstractDocument {
  @Prop()
  serverPublicKey: string;

  @Prop()
  sharedSecret: string;

  @Prop()
  publicKey: string;

  @Prop()
  key: string;
}

export const EncryptionSchema =
  SchemaFactory.createForClass(EncryptionDocument);
