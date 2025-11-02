import { Controller, Post, Body, Get, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../gateway/quard-gateway-service/auth.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body('phone') phone: string) {
    await this.authService.sendOtp(phone);
    return { message: 'OTP sent successfully' };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { phone: string; code: string }) {
    const token = await this.authService.verifyOtp(body.phone, body.code);
    return { token };
  }

  @UseGuards(AuthGuard)
  @Get('sessions')
  async getSessions(@Req() req: Request) {
    const userId = req['user'].id;
    const sessions = await this.authService.getSessions(userId);
    return sessions;
  }

  @UseGuards(AuthGuard)
  @Delete('sessions/:tokenId')
  async deleteSession(@Req() req: Request, @Param('tokenId') tokenId: string) {
    const userId = req['user'].id;
    await this.authService.deleteSession(tokenId, userId);
    return { message: 'Session deleted successfully' };
  }
}