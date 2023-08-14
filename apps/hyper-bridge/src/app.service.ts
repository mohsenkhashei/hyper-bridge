import {
  Inject,
  Injectable,
  LoggerService,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HandshakeUserDto } from './dto/handshake.user.dto';
import { EncryptionService } from '@app/common/encryption/service/encryption.service';
import { EncryptedDataDto } from './dto/encrypted.data.dto';
import { UserCredentialDto } from './dto/user.credential.dto';
import { AppRepository } from './app.repository';
import { RESTYPE, ResponseFormatDto } from './dto/response.format.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly encryptionService: EncryptionService,
    private readonly appRepository: AppRepository,
  ) {}

  async handshake(
    handshakeUserDto: HandshakeUserDto,
  ): Promise<ResponseFormatDto> {
    const { key, prime, generator } = handshakeUserDto;
    const data = await this.encryptionService.recipientKeys(
      prime,
      generator,
      key,
    );
    return { responseType: RESTYPE.KEY, data: data.public_key };
  }

  async verifyUser(
    encryptedDataDto: EncryptedDataDto,
    headers: Headers, // : Promise<ResponseType>
  ) {
    try {
      const publicKey = headers['key'];
      const payload = encryptedDataDto.data;
      const decryptedData = await this.encryptionService.decryptPayload(
        publicKey,
        payload,
      );
      await this.checkUserCredentialIsValid(decryptedData);
      const user = await this.checkUserExist(decryptedData);
      return user;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async checkUserCredentialIsValid(userCredentialDto: UserCredentialDto) {
    //check decrypted data is valid format ( UserCredentialDto )
    const decryptedUserCredential = plainToClass(
      UserCredentialDto,
      userCredentialDto,
    );
    const decryptedUserCredentialError = await validate(
      decryptedUserCredential,
    );
    if (decryptedUserCredentialError.length > 0) {
      throw new UnauthorizedException('User Credential Format is not valid.');
    }
  }
  async checkUserExist(userCredentialDto: UserCredentialDto) {
    //check user exist in DB
    const user = await this.appRepository.findOne({
      customerNo: userCredentialDto.customerNo,
    });
    if (user) {
      const passwordIsValid = await bcrypt.compare(
        userCredentialDto.password,
        user.password,
      );
      if (!passwordIsValid) {
        throw new UnauthorizedException(`Credentials are not valid.`);
      }
      return user;
    }
  }

  /**
   * using from authetication middleware
   * @param publicKey
   * @returns boolean
   */
  async checkPublicKeyIsValid(publicKey: string) {
    return await this.encryptionService.checkPublicKeyExist(publicKey);
  }
}
