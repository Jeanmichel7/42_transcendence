import { MiddlewareConsumer, Module, NestModule }                       from '@nestjs/common';
import { ConfigModule, ConfigService }  from '@nestjs/config';
import { TypeOrmModule }                from '@nestjs/typeorm';
import { EventEmitterModule }           from '@nestjs/event-emitter';
import * as cors from 'cors';
import { typeOrmConfig }                from 'src/config/typeorm.config';

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
    EventEmitterModule.forRoot(),
    WebsocketModule,
    UsersModule,
    UsersRelationsModule,
    MessageModule,
    AuthModule,
  ],
})

// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}


