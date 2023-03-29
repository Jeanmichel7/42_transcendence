import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserInfo } from 'src/typeorm';
// import { MessageInfo } from 'src/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// import { MessageController } from 'src/messages/messages.controller';
// import { MessageService } from 'src/messages/messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo,]), ],
  providers: [UsersService],
  controllers: [UsersController, ]
})
export class UsersModule {}
