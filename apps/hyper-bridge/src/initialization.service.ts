import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UsersDocument } from './models/users.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class InitializationService implements OnModuleInit {
  constructor(
    @InjectModel(UsersDocument.name) private usersModel: Model<UsersDocument>,
  ) {}

  async onModuleInit() {
    await this.createCollections();
  }

  async createCollections() {
    const user = await this.usersModel.findOne({ customerNo: 2222 });

    if (!user) {
      const data = {
        _id: new mongoose.Types.ObjectId(),
        customerNo: 2222,
        password: await bcrypt.hash('12345', 10),
      };

      await this.usersModel.create(data);
      console.log('User Created Successfully!');
    }
  }
}
