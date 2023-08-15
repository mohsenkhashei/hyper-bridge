import {
  Inject,
  Injectable,
  LoggerService,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RegisterDeviceDto } from './dto/register.device';
import { EncryptionService } from '@app/common/encryption/service/encryption.service';
import { UserCredentialDto } from './dto/user.credential.dto';
import { UsersRepository } from './repositories/users.repository';
import {
  COMMUNICATION_TYPE,
  RequestFormatDto,
  ResponseFormatDto,
} from './dto/data.format.type.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { DevicesRepository } from './repositories/devices.repository';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly encryptionService: EncryptionService,
    private readonly usersRepository: UsersRepository,
    private readonly devicesRepository: DevicesRepository,
  ) {}
  /**
   *
   * @param registerDeviceDto
   * @returns Promise<ResponseFormatDto>
   */
  async register(
    registerDeviceDto: RegisterDeviceDto,
  ): Promise<ResponseFormatDto> {
    try {
      //generating keys
      const keysGenerated =
        await this.encryptionService.generateSharedSecretKeyFromPublicKey(
          registerDeviceDto.publicKey,
        );

      //saving device data or updating
      const data = await this.createOrUpdateDevice(
        registerDeviceDto,
        keysGenerated.serverPublicKey,
      );
      return { responseType: COMMUNICATION_TYPE.JSON, data };
    } catch (err) {
      this.logger.error(`${AppService.name} : ${err}`);
      throw new UnprocessableEntityException('Device Registration Failed.');
    }
  }
  private async createOrUpdateDevice(
    registerDeviceDto: RegisterDeviceDto,
    serverPublicKey: string,
  ) {
    const deviceFound = await this.devicesRepository.findOne({
      publicKey: registerDeviceDto.publicKey,
      serverPublicKey: serverPublicKey,
      deviceId: registerDeviceDto.deviceId,
    });
    if (deviceFound) {
      const { _id, ...newAddedDevice } = deviceFound; // remove _id from data
      return newAddedDevice;
    } else {
      const newlyAddedDevice = await this.devicesRepository.create({
        serverPublicKey,
        ...registerDeviceDto,
      });
      const { _id, ...newAddedDevice } = newlyAddedDevice; // remove _id from data
      return newAddedDevice;
    }
  }

  /**
   *
   * @param requestFormatDto
   * @param headers
   * @returns Promise<ResponseFormatDto>
   */
  async authenticateCustomer(
    requestFormatDto: RequestFormatDto,
    headers: Headers,
  ): Promise<ResponseFormatDto> {
    try {
      const publicKey = headers['key'];
      const payload = requestFormatDto.data as unknown as string;
      console.log(publicKey);
      console.log(payload);
      const decryptedData = await this.encryptionService.decrypting(
        payload,
        publicKey,
      );

      //check valid data
      const userCredential = JSON.parse(decryptedData);

      await this.checkUserCredentialIsValid(userCredential);
      // // check user exist in DB or not
      const user = await this.checkUserExist(userCredential);
      console.log(user);
      // create new user for response
      const { _id, password, ...safeUser } = user;
      console.log({ safeUser });
      // encrypt data
      const encryptedData = await this.encryptionService.encrypting(
        JSON.stringify(safeUser),
        publicKey,
      );
      console.log(encryptedData);
      return { responseType: COMMUNICATION_TYPE.HASH, data: encryptedData };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async checkUserCredentialIsValid(
    userCredentialDto: UserCredentialDto,
  ) {
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
  private async checkUserExist(userCredentialDto: UserCredentialDto) {
    //check user exist in DB
    const user = await this.usersRepository.findOne({
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
    } else {
      throw new UnauthorizedException(`User is not existed`);
    }
  }

  /**
   * using from authentication middleware
   * @param publicKey
   * @returns boolean
   */
  async checkPublicKeyIsValid(publicKey: string) {
    return await this.encryptionService.checkPublicKeyExist(publicKey);
  }
}
