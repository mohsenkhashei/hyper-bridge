import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../../database/abstract.schema';

// export type EncryptionDocument = Encryption & Document;

@Schema({ versionKey: false })
export class EncryptionDocument extends AbstractDocument {
  @Prop()
  key: string;

  @Prop()
  prime: string;

  @Prop()
  generator: string;

  @Prop()
  publicKey?: string;

  @Prop()
  secretKey?: string;
}

export const EncryptionSchema =
  SchemaFactory.createForClass(EncryptionDocument);
