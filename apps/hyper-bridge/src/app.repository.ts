import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersDocument } from './models/users.schema';

@Injectable()
export class AppRepository extends AbstractRepository<UsersDocument> {
  protected readonly logger = new Logger(AppRepository.name);

  constructor(
    @InjectModel(UsersDocument.name)
    usersModel: Model<UsersDocument>,
  ) {
    super(usersModel);
  }
}
