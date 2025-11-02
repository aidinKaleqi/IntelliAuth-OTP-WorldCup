import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SmsService } from '../gateway/sms-gateway-service/sms.service';
import { AuthGuard } from '../gateway/quard-gateway-service/auth.guard';
import { SessionRepository } from './model/repository/session.repository';
import { UserModule } from '../user/user.module';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionRepository]),
    HttpModule,
    UserModule,
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SmsService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}