import { Injectable } from '@nestjs/common';
import { HandshakeUserDto } from './dto/handshake.user.dto';
import { EncryptionService } from '@app/common/encryption/service/encryption.service';
import { EncryptedDataDto } from './dto/encrypted.data.dto';
import { UserCredentialDto } from './dto/user.credential.dto';
import { AppRepository } from './app.repository';
import * as bcrypt from 'bcryptjs';
import { UsersDocument } from './models/users.schema';

@Injectable()
export class AppService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly appRepository: AppRepository,
  ) {}

  async handshake(handshakeUserDto: HandshakeUserDto) {
    const { key, prime, generator } = handshakeUserDto;
    const data = await this.encryptionService.recipientKeys(
      prime,
      generator,
      key,
    );
    return { public_key: data.public_key };
  }

  async validateUser(encryptedDataDto: EncryptedDataDto, headers: Headers) {
    const public_key = headers['key'];
    const data = {
      payload: encryptedDataDto.data,
      salt: 'Mohsen',
    };
    const userCredential: UserCredentialDto =
      await this.encryptionService.decryptPayload(public_key, data);

    console.log(userCredential.customerNo);
  }

  async generateUser() {
    setTimeout(async () => {
      const user = this.appRepository.findOne({ customerNo: 2222 });
      if (!user) {
        const password: string = await bcrypt.hash('12345', 10);
        const data = {
          customerNo: 2222,
          password,
        };
        await this.appRepository.create(data);
      }
    }, 10000);
  }
}
