import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserInterface } from './interfaces/users.interface';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [ConfigModule, JwtModule.register({})],
      providers: [
        UsersService,
        ConfigService,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should return an array of users', async () => {
    const result: UserInterface[] = [
      {
        id: BigInt(1),
        firstName: 'hein',
        lastName: '',
        login: '',
        email: '',
        description: '',
        avatar: '',
        role: '',
        status: '',
        is2FAEnabled: false,
      },
    ];
    jest.spyOn(usersService, 'findAll').mockImplementation(async () => result);

    const users = await usersController.findAll();
    expect(users).toBe(result);
    expect(users[0].firstName).toBe('John');
  });
});
