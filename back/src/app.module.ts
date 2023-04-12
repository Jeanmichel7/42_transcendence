import { MiddlewareConsumer, Module, NestModule }                       from '@nestjs/common';
import { ChatController } from './modules/chat/chat.controller';
import { ChatModule } from './modules/chat/chat.module';
import { ConfigModule, ConfigService }  from '@nestjs/config';
import { TypeOrmModule }                from '@nestjs/typeorm';
import { EventEmitterModule }           from '@nestjs/event-emitter';
import { MulterModule }                 from '@nestjs/platform-express';
import { typeOrmConfig }                from 'src/config/typeorm.config';
import * as cors                        from 'cors';

import { AuthModule }                   from './modules/auth/auth.module';
import { UsersModule }                  from './modules/users/users.module';
import { UsersRelationsModule }         from './modules/users_relations/users_relations.module';
import { MessageModule }                from './modules/messagerie/messages.module';
import { WebsocketModule }              from './modules/webSockets/websocket.module';

import { ServeStaticModule }            from '@nestjs/serve-static';
import { join }                         from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'client'),
      serveRoot: '/static'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'users_avatars'),
      serveRoot: '/avatars'
    }),
    EventEmitterModule.forRoot(),
    WebsocketModule,
    UsersModule,
    UsersRelationsModule,
    MessageModule,
    AuthModule,
    ChatModule,
  ],
})

// /home/jrasser/42_transcendence/back/uploads/users_avatars/420f91c67864248ded86e204aa98be2f.png


// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
