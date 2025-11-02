import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly baseUrl = 'http://RestfulSms.com/api/';
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly lineNumber?: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('SMS_IR_API_KEY');
    if (!apiKey) {
      throw new Error('SMS_IR_API_KEY is not defined in the configuration.');
    }
    this.apiKey = apiKey;

    const secretKey = this.configService.get<string>('SMS_IR_SECRET_KEY');
    if (!secretKey) {
      throw new Error('SMS_IR_SECRET_KEY is not defined in the configuration.');
    }
    this.secretKey = secretKey;

    this.lineNumber = this.configService.get<number>('SMS_IR_LINE_NUMBER');
  }

  private async getToken(): Promise<string | null> {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}Token`, {
          UserApiKey: this.apiKey,
          SecretKey: this.secretKey,
          System: 'nestjs_rest_v1',
        }),
      );
      return response.data.IsSuccessful ? response.data.TokenKey : null;
    } catch (error) {
      console.error('SMS.IR Token error:', error.response?.data || error.message);
      return null;
    }
  }

  async sendVerificationCode(code: string, mobileNumber: string): Promise<string | null> {
    const token = await this.getToken();
    if (!token) return null;
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.baseUrl}VerificationCode`,
          { Code: code, MobileNumber: mobileNumber },
          { headers: { 'x-sms-ir-secure-token': token } },
        ),
      );
      return response.data.Message;
    } catch (error) {
      console.error('SMS.IR Verification error:', error.response?.data || error.message);
      return null;
    }
  }

  async sendMessage(mobileNumbers: string[], messages: string[]): Promise<string | null> {
    const token = await this.getToken();
    if (!token) return null;
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.baseUrl}MessageSend`,
          {
            Messages: messages,
            MobileNumbers: mobileNumbers,
            LineNumber: this.lineNumber,
            CanContinueInCaseOfError: 'false',
          },
          { headers: { 'x-sms-ir-secure-token': token } },
        ),
      );
      return response.data.Message;
    } catch (error) {
      console.error('SMS.IR Send error:', error.response?.data || error.message);
      return null;
    }
  }
}