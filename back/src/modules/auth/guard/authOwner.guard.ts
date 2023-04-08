import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthOwner implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext,): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token)
      throw new UnauthorizedException("You are not authorized to access this resource")
    const payload = this.jwtService.verify(token);

    const userId = request.params.userId;
    if (payload.sub === userId)
      return true;

    throw new UnauthorizedException("You are not authorized to access this resource")
  }
}
