import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './guard/constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/users.entity';
import { AuthOwner } from './guard/authOwner.guard';
import { AuthAdmin } from './guard/authAdmin.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2 days' },
    }),
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [
    AuthService, 
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthOwner, AuthAdmin
  ],
  controllers: [AuthController]
})
export class AuthModule {}
