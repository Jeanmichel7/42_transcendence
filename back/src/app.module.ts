import { Module } from '@nestjs/common';
import { ChatModule } from './modules/chat/chat.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { typeOrmConfig } from 'config/typeorm.config';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UsersRelationsModule } from './modules/users_relations/users_relations.module';
import { MessageModule } from './modules/messagerie/messages.module';
import { GameModule } from './modules/game/game.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'config/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'users_avatars'),
      serveRoot: '/avatars',
      renderPath: '*./uploads/*',
      serveStaticOptions: {
        index: false,
      },
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    UsersRelationsModule,
    MessageModule,
    AuthModule,
    ChatModule,
    GameModule,
  ],
})
export class AppModule {}
