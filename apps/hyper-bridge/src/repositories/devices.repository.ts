import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { DevicesDocument } from '../models/devices.schema';

@Injectable()
export class DevicesRepository extends AbstractRepository<DevicesDocument> {
  protected readonly logger = new Logger(DevicesRepository.name);

  constructor(
    @InjectModel(DevicesDocument.name)
    devicesModel: Model<DevicesDocument>,
  ) {
    super(devicesModel);
  }
}
