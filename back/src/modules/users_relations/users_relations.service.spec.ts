import { Test, TestingModule } from '@nestjs/testing';
import { UsersRelationsService } from './users_relations.service';

describe('UsersRelationsService', () => {
  let service: UsersRelationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRelationsService],
    }).compile();

    service = module.get<UsersRelationsService>(UsersRelationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
