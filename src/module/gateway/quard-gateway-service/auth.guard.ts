import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { SessionRepository } from '../../auth/model/repository/session.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const tokenHash = await bcrypt.hash(token, 10); // Hash the incoming token
    const session = await this.sessionRepository.findByTokenHash(tokenHash);
    if (!session || (session.expires_at && session.expires_at < new Date())) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request['user'] = { id: session.user_id };

    return true;
  }
}