import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    const fromEmail = this.configService.get<string>(
      'SMTP_FROM_EMAIL',
      'noreply@localhire.com',
    );
    const subject = 'LocalHire - Password Reset OTP';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Please use the following OTP code:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; margin: 20px 0;">
          <strong>${otp}</strong>
        </div>
        <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    return this.sendEmail(fromEmail, email, subject, html);
  }

  private async sendEmail(
    from: string,
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<string>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
      return true;
    }

    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || '587', 10),
        secure: smtpPort === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }
}
