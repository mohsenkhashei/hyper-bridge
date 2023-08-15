import { Injectable, NotFoundException } from '@nestjs/common';
import { EncryptionRepository } from '../encryption.repository';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  getDiffieHellman,
} from 'crypto';

@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-cbc';

  constructor(private readonly encryptionRepository: EncryptionRepository) {}

  async checkPublicKeyExist(publicKey: string) {
    return (await this.encryptionRepository.findOne({
      publicKey,
    }))
      ? true
      : false;
  }
  async generateSharedSecretKeyFromPublicKey(publicKey: string) {
    const dataExist = await this.encryptionRepository.findOne({ publicKey });
    if (dataExist) {
      const { _id, sharedSecret, key, publicKey, ...newData } = dataExist;
      return newData;
    } else {
      const server = getDiffieHellman('modp15');
      server.generateKeys();
      const serverPublicKey = server.getPublicKey('hex');
      const sharedSecret = server.computeSecret(publicKey, 'hex', 'hex');
      const key = this.generatingKey(sharedSecret);

      // saving to db
      await this.encryptionRepository.create({
        serverPublicKey,
        publicKey,
        sharedSecret,
        key,
      });
      return { serverPublicKey };
    }
  }
  async decrypting(encryptedData: string, publicKey: string) {
    try {
      const key = await this.getKeyFromDB(publicKey);
      const decryptingData = this.decryptingData(encryptedData, key);
      return decryptingData;
    } catch (err) {
      throw err;
    }
  }
  async encrypting(data: string, publicKey: string) {
    try {
      const key = await this.getKeyFromDB(publicKey);
      const encryptedData = this.encryptingData(data, key);
      return encryptedData;
    } catch (err) {
      throw err;
    }
  }
  private async getKeyFromDB(publicKey: string): Promise<string> {
    const dbResult = await this.encryptionRepository.findOne({ publicKey });
    if (dbResult) {
      return dbResult.key;
    } else {
      throw new NotFoundException('No User Found With Public Key');
    }
  }
  private generatingKey(secretKey) {
    // Generate secret hash with crypto to use for encryption
    const key = createHash('sha512')
      .update(secretKey)
      .digest('hex')
      .substring(0, 32);

    return key;
  }
  // Encrypt data
  private encryptingData(data, key) {
    const encryptionIV = createHash('sha512').digest('hex').substring(0, 16);
    const cipher = createCipheriv(this.algorithm, key, encryptionIV);
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
    ).toString('base64'); // Encrypts data and converts to hex and base64
  }
  // Decrypt data
  private decryptingData(encryptedData, key) {
    const encryptionIV = createHash('sha512').digest('hex').substring(0, 16);
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = createDecipheriv(this.algorithm, key, encryptionIV);
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    ); // Decrypts data and converts to utf8
  }
}
