import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, UpdateQuery } from 'mongoose';
import { UsersDocument } from '../models/users.schema';

@Injectable()
export class UsersRepository extends AbstractRepository<UsersDocument> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(UsersDocument.name)
    private readonly usersModel: Model<UsersDocument>,
  ) {
    super(usersModel);
  }

  async findOneAndUpdateWithDevices(
    filterQuery: FilterQuery<UsersDocument>,
    update: UpdateQuery<UsersDocument>,
  ) {
    const document = await this.usersModel
      .findOneAndUpdate(filterQuery, update, {
        lean: true,
        new: true,
      })
      .populate('devices', { _id: 0, user: 0 })
      .exec();

    if (!document) {
      this.logger.warn(`Document not found with filterQuery: ${filterQuery}`);
      throw new NotFoundException(`User not found.`);
    }

    return document;
  }
  async findUserAndDevices(
    filterQuery: FilterQuery<UsersDocument>,
    fields?: ProjectionType<UsersDocument>,
  ): Promise<UsersDocument | null> {
    try {
      const result = await this.usersModel
        .findOne(filterQuery, fields, { lean: true })
        .populate('devices', { _id: 0, user: 0 })
        .exec();
      this.logger.log(result);
      return result;
    } catch (error) {
      this.logger.error(
        `Error while finding and populating user: ${error.message}`,
      );
      throw error;
    }
  }
}
