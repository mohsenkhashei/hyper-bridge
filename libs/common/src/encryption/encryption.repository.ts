import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EncryptionDocument } from './models/encryption.schema';

@Injectable()
export class EncryptionRepository extends AbstractRepository<EncryptionDocument> {
  protected readonly logger = new Logger(EncryptionRepository.name);

  constructor(
    @InjectModel(EncryptionDocument.name)
    encryptionModel: Model<EncryptionDocument>,
  ) {
    super(encryptionModel);
  }
}
