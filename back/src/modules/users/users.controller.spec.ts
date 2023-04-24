import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserInterface } from './interfaces/users.interface';
import { UserCreateDTO } from './dto/user.create.dto';
import { ProfilInterface } from './interfaces/profil.interface';
import { RequestWithUser } from './interfaces/request.user.interface';
import { HttpStatus } from '@nestjs/common';

jest.mock('./users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findOne', () => {
    it('should return user data', async () => {
      const mockUser: UserInterface = {
        id: BigInt(1),
        firstName: 'John',
        lastName: 'Doe',
        login: 'john.doe',
        email: '',
        description: 'I am John Doe',
      };

      const mockRequest: RequestWithUser = {
        user: { id: 1 },
      } as any;

      jest.spyOn(usersService, 'findUser').mockResolvedValue(mockUser);

      const result = await usersController.findOne(mockRequest);

      expect(result).toEqual(mockUser);
      expect(usersService.findUser).toHaveBeenCalledWith(mockRequest.user.id);
    });
  });

  // Ajoutez des tests pour les autres méthodes du contrôleur ici
});
