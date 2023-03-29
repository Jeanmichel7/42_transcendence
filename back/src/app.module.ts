import { Module }                       from '@nestjs/common';
import { ConfigModule, ConfigService }  from '@nestjs/config';
import { TypeOrmModule }                from '@nestjs/typeorm';

import { typeOrmConfig }                from '../config/typeorm.config';

import { AuthModule }                   from './auth/auth.module';
// import { AppController }                from './app.controller';
// import { AppService }                   from './app.service';
import { UsersModule }                  from './users/users.module';
import { MessageModule }                from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    MessageModule,
    AuthModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
