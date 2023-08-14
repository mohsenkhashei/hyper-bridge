import { Encrypt } from './encrypt';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { KeyGeneratorService } from './key.generator.service';
import { EncryptionRepository } from '../encryption.repository';

@Injectable()
export class EncryptionService {
  private salt = 'Mohsen';

  constructor(
    private readonly keyGeneratorService: KeyGeneratorService,
    private readonly encryptionRepository: EncryptionRepository,
  ) {}

  async recipientKeys(
    prime: string,
    generator: string,
    key: string,
  ): Promise<{ public_key: string }> {
    const public_key = this.keyGeneratorService.recipientKey(prime, generator);
    const secretKey = this.keyGeneratorService.recipientSecret(key);
    //DB
    await this.encryptionRepository.create({
      prime,
      generator,
      key,
      publicKey: public_key,
      secretKey,
    });
    return { public_key };
  }

  async decryptPayload(publicKey: string, payload: string) {
    try {
      const res = await this.encryptionRepository.findOne({
        publicKey,
      });

      if (!res) {
        throw new NotFoundException('Invalid header value');
      }

      const encryption = new Encrypt(res.secretKey, this.salt);
      return JSON.parse(encryption.decrypt(payload));
    } catch (err) {
      throw new NotAcceptableException('there is problem with decryption');
    }
  }

  async encryptPayload(publicKey: string, payload: object) {
    const res = await this.encryptionRepository.findOne({
      publicKey,
    });

    if (!res) {
      throw new NotFoundException('Invalid public key value');
    }

    const encryption = new Encrypt(res.secretKey, this.salt);
    return { payload: encryption.encrypt(JSON.stringify(payload)) };
  }

  async checkPublicKeyExist(publicKey: string) {
    return (await this.encryptionRepository.findOne({
      publicKey,
    }))
      ? true
      : false;
  }
}
