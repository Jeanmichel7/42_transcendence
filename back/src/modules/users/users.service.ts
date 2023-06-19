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

import { UserInterface } from './interfaces/users.interface';
import { ProfilInterface } from './interfaces/profil.interface';

import { UserPatchDTO } from './dto/user.patch.dto';
import { UserCreateDTO } from './dto/user.create.dto';
import axios from 'axios';
import { join } from 'path';
import { ChatRoomInterface } from '../chat/interfaces/chat.room.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserUpdateEvent } from '../notification/events/notification.event';

@Injectable()
export class UsersService {
  private intervalId: NodeJS.Timeout;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    const absentDuration: number = 1 * 60 * 1000; // 15min
    this.intervalId = setInterval(() => {
      console.log('check user status');
      this.checkUserStatus(absentDuration);
    }, 60000);
  }

  onModuleDestroy() {
    clearInterval(this.intervalId);
  }

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

  async findAllUsers(): Promise<UserInterface[]> {
    const users: UserEntity[] = await this.userRepository.find({
      select: [
        'id',
        'firstName',
        'lastName',
        'login',
        'email',
        'status',
        'description',
        'avatar',
      ],
    });
    if (!users) throw new NotFoundException(`No users found`);
    const result: UserInterface[] = users.map((user) => ({ ...user }));
    return result;
  }

  async findAllData(id: bigint): Promise<UserInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: id },
      relations: [
        'chatMessages',
        'friends',
        'blocked',
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
      return await this.userRepository.save(newUser);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createOAuthUser(data: any): Promise<UserInterface> {
    let login: string = data.login;
    let isAvailable: boolean = await this.isLoginAvailable(login);
    if (!isAvailable) {
      do {
        login = login + Math.floor(Math.random() * 1000);
        isAvailable = await this.isLoginAvailable(login);
      } while (!isAvailable);
    }

    const newUser = new UserEntity();
    newUser.firstName = data.first_name;
    newUser.lastName = data.last_name;
    newUser.login = login;
    newUser.email = data.email;
    newUser.description = data.description;
    const avatarName: string = await this.uploadAndSaveAvatar(data.image.link);
    newUser.avatar = 'http://localhost:3000/avatars/' + avatarName;
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
      updateData.avatar = 'http://localhost:3000/avatars/' + file.filename;
      this.deleteAvatar(userToUpdate.avatar);
    } else if (updateUser.avatar) updateData.avatar = updateUser.avatar;
    if (updateUser.firstName) updateData.firstName = updateUser.firstName;
    if (updateUser.lastName) updateData.lastName = updateUser.lastName;
    if (updateUser.login) {
      const isAvailable: boolean = await this.isLoginAvailable(
        updateUser.login,
      );
      if (!isAvailable)
        throw new BadRequestException(
          `Login ${updateUser.login} not available`,
        );
      updateData.login = updateUser.login;
    }
    if (updateUser.email) {
      const isAvailable: boolean = await this.isEmailAvailable(
        updateUser.email,
      );
      if (!isAvailable)
        throw new BadRequestException(
          `Email ${updateUser.email} not available`,
        );
      updateData.email = updateUser.email;
    }
    if (updateUser.description) updateData.description = updateUser.description;
    if (updateUser.password) {
      const isMatch = await bcrypt.compare(
        userToUpdate.password,
        updateUser.oldPassword,
      );
      if (!isMatch) throw new BadRequestException(`Wrong password`);
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

  private async isEmailAvailable(email: string): Promise<boolean> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { email: email },
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
    // console.log('path : ', localImagePath);

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

  async checkUserStatus(absentDuration: number): Promise<void> {
    const users: UserEntity[] = await this.userRepository.find({
      select: ['id', 'lastActivity', 'login', 'avatar', 'status'],
    });
    // console.log('users before: ', users);
    for (const user of users) {
      if (user.status === 'offline') continue;
      const inactivityDuration =
        Date.now() - new Date(user.lastActivity).getTime();

      if (inactivityDuration > 4 * absentDuration) {
        await this.userRepository.update(
          { id: user.id },
          {
            status: 'offline',
            updatedAt: new Date(),
          },
        );

        const userUpdated = new UserUpdateEvent({
          id: user.id,
          status: 'offline',
          login: user.login,
          avatar: user.avatar,
          updatedAt: new Date(),
        });
        console.log(
          'userUpdated offline: ',
          userUpdated.userStatus.id,
          userUpdated.userStatus.login,
        );
        this.eventEmitter.emit('user_status.updated', userUpdated);
      } else if (inactivityDuration > absentDuration) {
        await this.userRepository.update(
          { id: user.id },
          {
            status: 'absent',
            updatedAt: new Date(),
          },
        );
        // console.log('res update status user: ', res);

        const userUpdated = new UserUpdateEvent({
          id: user.id,
          status: 'absent',
          login: user.login,
          avatar: user.avatar,
          updatedAt: new Date(),
        });
        console.log(
          'userUpdated absent: ',
          userUpdated.userStatus.id,
          userUpdated.userStatus.login,
        );
        this.eventEmitter.emit('user_status.updated', userUpdated);
      }
    }
  }

  async getRooms(id: bigint): Promise<ChatRoomInterface[]> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: id },
      relations: ['roomUsers'],
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    const rooms: ChatRoomInterface[] = [...user.roomUsers];
    return rooms;
  }

  /* ************************************************ */
  /*                                                  */
  /*                       ADMIN                      */
  /*                                                  */
  /* ************************************************ */

  async findUserAllData(id: bigint): Promise<UserInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: id },
      relations: [
        'messagesSend',
        'messagesReceive',
        'chatMessages',
        'friends',
        'blocked',
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
