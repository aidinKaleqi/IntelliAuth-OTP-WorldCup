import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UserService} from '../user/user.service';
import { SmsService } from '../gateway/sms-gateway-service/sms.service';
import { SessionRepository} from './model/repository/session.repository';
import { SessionEntity } from './model/entity/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly sessionRepository: SessionRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(phone: string): Promise<void> {
    const sendLimitKey = `otp:send:limit:${phone}`;
    const limit = await this.redis.get(sendLimitKey);
    if (limit) {
      throw new HttpException('OTP send limit exceeded. Try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = this.generateOtp();
    const expiresAt = Date.now() / 1000 + 120;

    await this.redis.set(
      `otp:phone:${phone}`,
      JSON.stringify({ code, expiresAt, attempts: 0 }),
      'EX',
      120
    );
    await this.redis.set(
      sendLimitKey,
      '1',
      'EX',
      120
    );


    const result = await this.smsService.sendVerificationCode(code, phone);
    if (!result) {
      throw new BadRequestException('Failed to send OTP');
    }
  }

  async verifyOtp(phone: string, code: string): Promise<string> {
    const otpKey = `otp:phone:${phone}`;
    const attemptKey = `otp:verify:attempts:${phone}`;

    const otpDataStr = await this.redis.get(otpKey);
    if (!otpDataStr) {
      throw new BadRequestException('OTP expired or invalid');
    }

    const otpData = JSON.parse(otpDataStr);
    if (Date.now() / 1000 > otpData.expiresAt) {
      await this.redis.del(otpKey);
      throw new BadRequestException('OTP expired');
    }

    const attempts = await this.redis.incr(attemptKey);
    if (attempts === 1) {
      await this.redis.expire(attemptKey, 60);
    }
    if (attempts > 5) {
      throw new HttpException('OTP_EXCEEDED', HttpStatus.TOO_MANY_REQUESTS);
    }

    if (otpData.code !== code) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.redis.del([otpKey, attemptKey]);

    // Find or create user
    let user = await this.userService.findByPhone(phone);
    if (!user) {
      user = await this.userService.createUser(phone);
    }


    const token = uuidv4();
    const tokenHash = await bcrypt.hash(token, 10);
    const session = this.sessionRepository.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await this.sessionRepository.save(session);

    return token; // Return plain token to client
  }

  async getSessions(userId: string): Promise<SessionEntity[]> {
    return this.sessionRepository.findByUserId(userId);
  }

  async deleteSession(tokenId: string, userId: string): Promise<void> {
    const session = await this.sessionRepository.findOne({ where: { id: tokenId, user_id: userId } });
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    await this.sessionRepository.remove(session);
  }
}