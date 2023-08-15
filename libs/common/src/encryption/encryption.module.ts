import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '../config/config.module';

import { MongooseModule } from '@nestjs/mongoose';
import {
  EncryptionDocument,
  EncryptionSchema,
} from './models/encryption.schema';
import { EncryptionService } from './service/encryption.service';
import { EncryptionRepository } from './encryption.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: EncryptionDocument.name, schema: EncryptionSchema },
    ]),
  ],
  providers: [EncryptionService, EncryptionRepository],
  exports: [EncryptionService],
})
export class EncryptionModule {}
