import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

// Create nodemailer transporter for Gmail
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email using SendGrid (preferred)
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Use SendGrid if API key is available
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: options.email,
        from: {
          email: process.env.EMAIL_FROM || 'noreply@realestate.com',
          name: process.env.EMAIL_FROM_NAME || 'Real Estate Platform',
        },
        subject: options.subject,
        html: options.message,
      };

      await sgMail.send(msg);
      console.log('Email sent successfully via SendGrid');
    }
    // Fallback to Gmail SMTP
    else if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = createGmailTransporter();

      const mailOptions = {
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Real Estate Platform',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER!,
        },
        to: options.email,
        subject: options.subject,
        html: options.message,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully via Gmail SMTP:', info.messageId);
    } else {
      console.warn('No email service configured. Please set up SendGrid or Gmail SMTP.');
      // In development, you might want to log the email content instead
      if (process.env.NODE_ENV === 'development') {
        console.log('Email would be sent:', {
          to: options.email,
          subject: options.subject,
          html: options.message,
        });
      }
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Real Estate Platform</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Real Estate Platform! 🎉</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}!</h2>
          <p>Thank you for joining our real estate platform. We're excited to help you find your perfect property or connect with potential buyers.</p>

          <p>Here's what you can do:</p>
          <ul>
            <li>🔍 Search thousands of properties</li>
            <li>❤️ Save your favorite listings</li>
            <li>⭐ Leave reviews and ratings</li>
            <li>📞 Connect with verified agents</li>
            <li>📧 Get personalized recommendations</li>
          </ul>

          <p>Ready to start exploring?</p>
          <a href="${process.env.FRONTEND_URL}" class="button">Browse Properties</a>

          <p>If you have any questions, feel free to reply to this email or contact our support team.</p>

          <p>Happy house hunting! 🏠</p>
        </div>
        <div class="footer">
          <p>© 2024 Real Estate Platform. All rights reserved.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email,
    subject: 'Welcome to Real Estate Platform!',
    message,
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>You requested a password reset</h2>
          <p>We received a request to reset your password for your Real Estate Platform account. Click the button below to create a new password:</p>

          <a href="${resetUrl}" class="button">Reset Password</a>

          <p><strong>This link will expire in 10 minutes</strong> for security reasons.</p>

          <div class="warning">
            <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </div>

          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">${resetUrl}</p>

          <p>For your security, this link will expire in 10 minutes.</p>
        </div>
        <div class="footer">
          <p>© 2024 Real Estate Platform. All rights reserved.</p>
          <p>If you have any questions, contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email,
    subject: 'Password Reset Request',
    message,
  });
};

// Send email verification
export const sendVerificationEmail = async (email: string, verificationUrl: string): Promise<void> => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Verify Your Email</h1>
        </div>
        <div class="content">
          <h2>Welcome to Real Estate Platform!</h2>
          <p>Thank you for creating an account. To get started, please verify your email address by clicking the button below:</p>

          <a href="${verificationUrl}" class="button">Verify Email Address</a>

          <p><strong>This link will expire in 24 hours</strong>.</p>

          <p>Once verified, you'll have full access to:</p>
          <ul>
            <li>🔍 Browse thousands of properties</li>
            <li>❤️ Save favorite listings</li>
            <li>⭐ Rate and review properties</li>
            <li>📧 Receive personalized recommendations</li>
          </ul>

          <p>If the button doesn't work, copy and paste this link:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
        </div>
        <div class="footer">
          <p>© 2024 Real Estate Platform. All rights reserved.</p>
          <p>If you didn't create this account, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email,
    subject: 'Verify Your Email - Real Estate Platform',
    message,
  });
};
