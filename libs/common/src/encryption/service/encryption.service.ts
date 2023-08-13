import { randomBytes } from 'crypto';
// import { createClient } from 'redis';
import { Encrypt } from './encrypt';
import { Injectable } from '@nestjs/common';
import { KeyGeneratorService } from './key.generator.service';
import { EncryptionRepository } from '../encryption.repository';
interface DataCollector {
  [key: string]: string;
}

@Injectable()
export class EncryptionService {
  private dataCollector: DataCollector;

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

  async decryptPayload(
    headerValue: string,
    data: { payload: string; salt: string },
  ) {
    const res = await this.encryptionRepository.findOne({
      publicKey: headerValue,
    });

    if (!res) {
      throw new Error('Invalid header value');
    }
    const encryption = new Encrypt(res.secretKey, data.salt);
    return JSON.parse(encryption.decrypt(data.payload));
  }

  async encryptPayload(publicKey: string, payload: object) {
    // const salt = randomBytes(32).toString('base64');
    const salt = 'Mohsen';
    const secretKey = await this.dataCollector[publicKey];
    if (!secretKey) {
      throw new Error('Invalid public key value');
    }
    const encryption = new Encrypt(secretKey, salt);
    return { payload: encryption.encrypt(JSON.stringify(payload)), salt };
  }
}
