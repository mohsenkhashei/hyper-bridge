import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UsersDocument } from './models/users.schema';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class InitializationService implements OnModuleInit {
  constructor(
    @InjectModel(UsersDocument.name) private usersModel: Model<UsersDocument>,
  ) {}

  async onModuleInit() {
    await this.createCollections();
  }

  async createCollections() {
    const user = await this.usersModel.findOne({ customerNo: 54321 });

    if (!user) {
      const data = {
        _id: new mongoose.Types.ObjectId(),
        userId: crypto.randomUUID(),
        customerNo: 54321,
        password: await bcrypt.hash('12345', 10),
        firstName: 'Mohsen',
        lastName: 'Khashei',
        email: 'muhsenkhasheii@gmail.com',
        phoneNumber: 959595959,
        address: 'cyprus nicosia',
        imageUrl: 'http://testImage.jpg',
        passportNo: 'p393939',
      };

      await this.usersModel.create(data);
      console.log('User Created Successfully!');
    }
  }
}
