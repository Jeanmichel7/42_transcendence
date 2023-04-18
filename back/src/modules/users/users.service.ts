import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  createWriteStream,
  existsSync,
  unlinkSync,
  access,
  mkdirSync,
} from 'fs';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { UserCreateDTO } from './dto/user.create.dto';
import { UserInterface } from './interfaces/users.interface';
import { ProfilInterface } from './interfaces/profil.interface';
import { UserPatchDTO } from './dto/user.patch.dto';
import axios from 'axios';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findUser(id: bigint): Promise<UserInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'firstName',
        'lastName',
        'login',
        'email',
        'status',
        'description',
        'avatar',
        'role',
        'is2FAEnabled',
      ],
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const result: UserInterface = { ...user };
    return result;
  }

  async findProfile(login: string): Promise<ProfilInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { login: login },
      select: [
        'id',
        'firstName',
        'lastName',
        'login',
        'email',
        'description',
        'avatar',
        'status',
      ],
    });
    if (!user) throw new NotFoundException(`User ${login} not found`);
    const result: ProfilInterface = { ...user };
    return result;
  }

  async findProfileById(userId: bigint): Promise<ProfilInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'firstName',
        'lastName',
        'login',
        'email',
        'description',
        'avatar',
        'status',
      ],
    });
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    const result: ProfilInterface = { ...user };
    return result;
  }

  async findAll(): Promise<UserInterface[]> {
    const users: UserEntity[] = await this.userRepository.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'login',
        'email',
        'description',
        'avatar',
        'role',
        'is2FAEnabled',
      ],
    });
    if (!users) throw new NotFoundException(`Users not found`);
    const result: UserInterface[] = [...users];
    return result;
  }

  /* probably useless but I keep it for now */
  async createUser(newUser: UserCreateDTO): Promise<UserEntity> {
    const result: UserEntity = await this.userRepository.findOneBy({
      login: newUser.login,
    });
    if (result)
      throw new NotFoundException(`User ${newUser.login} already exist`);

    try {
      const salt: string = await bcrypt.genSalt();
      const hash: string = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;
      return this.userRepository.save(newUser);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createOAuthUser(data: any): Promise<UserInterface> {
    let login: string = data.login;
    do login = login + Math.floor(Math.random() * 1000);
    while (!this.isLoginAvailable(login));

    const newUser = new UserEntity();
    newUser.firstName = data.first_name;
    newUser.lastName = data.last_name;
    newUser.login = login;
    newUser.email = data.email;
    newUser.description = data.description;
    const avatarName: string = await this.uploadAndSaveAvatar(data.image.link);
    newUser.avatar = avatarName;

    const user: UserEntity = await this.userRepository.save(newUser);
    if (!user) throw new NotFoundException(`User ${newUser.login} not created`);
    const result: UserInterface = { ...user };
    return result;
  }

  async patchUser(
    id: bigint,
    updateUser: UserPatchDTO,
    file: Express.Multer.File,
  ): Promise<UserInterface> {
    const userToUpdate: UserInterface = await this.findUser(id);
    if (!userToUpdate) throw new NotFoundException(`User ${id} not found`);

    const updateData: Partial<UserEntity> = {};
    if (file) {
      updateData.avatar = file.filename;
      this.deleteAvatar(userToUpdate.avatar);
    } else if (updateUser.avatar) updateData.avatar = updateUser.avatar;
    if (updateUser.firstName) updateData.firstName = updateUser.firstName;
    if (updateUser.lastName) updateData.lastName = updateUser.lastName;
    if (updateUser.login) updateData.login = updateUser.login;
    if (updateUser.email) updateData.email = updateUser.email;
    if (updateUser.description) updateData.description = updateUser.description;
    if (updateUser.password) {
      try {
        const hash: string = await bcrypt.hash(updateUser.password, 10);
        updateData.password = hash;
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    if (Object.keys(updateData).length > 0) {
      const isUpdated = await this.userRepository.update(
        { id: id },
        {
          ...updateData,
          updatedAt: new Date(),
        },
      );
      if (isUpdated.affected === 0)
        throw new BadRequestException(`User ${id} has not been updated.`);
    }

    const result: UserInterface = await this.findUser(id);
    return result;
  }

  // async updateUser(id: bigint, updateUser: UserCreateDTO): Promise<UserInterface> {
  // 	let userToUpdate: UserInterface = await this.findUser(id)
  // 	if (!userToUpdate)
  // 		throw new NotFoundException(`User ${id} not found`);

  // 	try {
  // 		const hash: string = await bcrypt.hash(updateUser.password, 10);
  // 		updateUser.password = hash;
  // 	} catch(e) {
  // 		throw new InternalServerErrorException(e);
  // 	}

  // 	let res = await this.userRepository.update({ id: id }, {
  // 		...updateUser,
  // 		updatedAt: new Date()
  // 	});
  // 	if(res.affected === 0)
  // 		throw new BadRequestException(`User ${id} has not been updated.`);

  // 	const result: UserInterface = await this.findUser(id);
  // 	return result;
  // }

  async deleteUser(id: bigint): Promise<void | string> {
    const userFound = await this.findUser(id);
    if (!userFound) throw new NotFoundException(`User with id ${id} not found`);

    const result = await this.userRepository.delete({ id: id });
    if (result.affected === 0) return `User ${id} not deleted`;
  }

  /* ************************************************ */
  /*                                                  */
  /*                       TOOLS                      */
  /*                                                  */
  /* ************************************************ */

  private async userExist(userId: bigint): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
    });
    if (!user) return false;
    return true;
  }

  private async isLoginAvailable(login: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { login: login },
      select: ['id'],
    });
    if (!user) return true;
    return false;
  }

  private async uploadAndSaveAvatar(url: string): Promise<string> {
    const avatarName: string =
      'avatar-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + '.jpg';
    const localImagePath: string = join(
      __dirname,
      '../../../..',
      'uploads',
      'users_avatars',
      avatarName,
    );
    console.log('path : ', localImagePath);

    if (!existsSync(join(__dirname, '../../../..', 'uploads', 'users_avatars')))
      mkdirSync(join(__dirname, '../../../..', 'uploads', 'users_avatars'));

    try {
      const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream',
      });
      const writer = createWriteStream(localImagePath);
      response.data.pipe(writer);
      writer.on('finish', () => {
        console.log('Image downloaded and saved successfully!');
      });
      writer.on('error', (error) => {
        console.error('Error while saving the image:', error);
      });
      return avatarName;
    } catch (error) {
      console.error('Error while downloading the image:', error);
    }
  }

  private async deleteAvatar(avatarName: string): Promise<void> {
    const localPath = join(
      __dirname,
      '../../../uploads/users_avatars/' + avatarName,
    );
    try {
      access(localPath, null);
    } catch (err) {
      console.error(`Le fichier "${localPath}" n'existe pas.`);
      return;
    }
    try {
      unlinkSync(localPath);
      console.log('Delete File successfully.');
    } catch (error) {
      throw new BadRequestException(`Avatar ${avatarName} not deleted`);
    }
  }

  /*  ADMIN  */
  async findUserAllData(id: bigint): Promise<UserInterface> {
    const user: UserInterface = await this.userRepository.findOne({
      where: { id: id },
      relations: [
        'chatMessages',
        'roomOwner',
        'roomAdmins',
        'roomUsers',
        'roomBannedUsers',
        'roomMutedUsers',
      ],
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }
}
