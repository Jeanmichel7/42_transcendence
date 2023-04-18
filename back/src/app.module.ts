import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ChatController } from './modules/chat/chat.controller';
import { ChatModule } from './modules/chat/chat.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { typeOrmConfig } from 'src/config/typeorm.config';
import * as cors from 'cors';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UsersRelationsModule } from './modules/users_relations/users_relations.module';
import { MessageModule } from './modules/messagerie/messages.module';
// import { WebsocketModule }              from './modules/webSockets/websocket.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import path, { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'client'),
      serveRoot: '/static',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'users_avatars'),
      serveRoot: '/avatars',
    }),
    EventEmitterModule.forRoot(),
    // WebsocketModule,
    UsersModule,
    UsersRelationsModule,
    MessageModule,
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(
//         cors({
//           origin: 'http://localhost:3006',
//           methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//           allowedHeaders: 'Content-Type, Accept',
//           credentials: true,
//         }),
//       )
//       .forRoutes('*');
//   }
// }
