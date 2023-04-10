import { Test, TestingModule } from '@nestjs/testing';
import { UsersRelationsController } from './users_relations.controller';

describe('UsersRelationsController', () => {
  let controller: UsersRelationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersRelationsController],
    }).compile();

    controller = module.get<UsersRelationsController>(UsersRelationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
