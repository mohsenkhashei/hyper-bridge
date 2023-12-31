import {
  FilterQuery,
  Model,
  ProjectionType,
  Types,
  UpdateQuery,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  // actual mongoose model base on TDocument
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    fields?: ProjectionType<TDocument>,
  ) {
    const document = await this.model.findOne(filterQuery, fields, {
      lean: true,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery: ${filterQuery}`);
      // throw new NotFoundException(`Document Not Found.`);
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery: ${filterQuery}`);
      throw new NotFoundException(`Document not found.`);
    }

    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return this.model.findOneAndDelete(filterQuery, { lean: true });
  }
}
