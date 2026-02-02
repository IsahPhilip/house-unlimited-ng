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
    // Use SendGrid if API key is available and valid
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
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
        .header { background: linear-gradient(135deg, #005555 0%, #008080 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to House Unlimited Nigeria! 🎉</h1>
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
    subject: 'Welcome to House Unlimited Nigeria!',
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

// Send newsletter welcome email
export const sendNewsletterWelcomeEmail = async (email: string, subscriberId: string): Promise<void> => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to Our Newsletter</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .highlight { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to House Unlimited Nigeria Newsletter!</h1>
        </div>
        <div class="content">
          <h2>Thank you for subscribing!</h2>
          <p>You're now part of our exclusive community. Get ready for:</p>

          <div class="highlight">
            <h3>📋 What to Expect:</h3>
            <ul>
              <li>🏠 Latest property listings</li>
              <li>💰 Market trends and insights</li>
              <li>💡 Home buying tips</li>
              <li>🎯 Exclusive deals and offers</li>
              <li>📅 Upcoming open houses</li>
            </ul>
          </div>

          <p>We'll send you our newsletter <strong>weekly</strong> with the most relevant content to help you stay informed about the real estate market.</p>

          <p>Want to explore properties right now?</p>
          <a href="${process.env.FRONTEND_URL}" class="button">Browse Properties</a>

          <div class="highlight">
            <h3>🔒 Privacy Promise:</h3>
            <p>We respect your privacy and will never share your email with third parties. You can unsubscribe at any time using the link at the bottom of any newsletter.</p>
          </div>

          <p>If you have any questions or need assistance, feel free to reply to this email.</p>

          <p>Happy house hunting! 🏠</p>
        </div>
        <div class="footer">
          <p>© 2024 Real Estate Platform. All rights reserved.</p>
          <p>You're receiving this email because you subscribed to our newsletter.</p>
          <p><a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a> | <a href="${process.env.FRONTEND_URL}/privacy">Privacy Policy</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email,
    subject: 'Welcome to House Unlimited Nigeria Newsletter!',
    message,
  });
};

// Send contact form notification
export const sendContactNotification = async (
  contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
    type?: string;
  }
): Promise<void> => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .label { font-weight: bold; color: #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .priority-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-left: 10px; }
        .urgent { background: #ffe6e6; color: #d63031; }
        .high { background: #fff3cd; color: #856404; }
        .medium { background: #e3f2fd; color: #1976d2; }
        .low { background: #f1f8e9; color: #388e3c; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
        </div>
        <div class="content">
          <h2>New Message Received</h2>
          
          <div class="info-box">
            <p><span class="label">Name:</span> ${contactData.name}</p>
            <p><span class="label">Email:</span> ${contactData.email}</p>
            ${contactData.phone ? `<p><span class="label">Phone:</span> ${contactData.phone}</p>` : ''}
            <p><span class="label">Type:</span> ${contactData.type || 'General'}</p>
            <p><span class="label">Subject:</span> ${contactData.subject}</p>
          </div>

          <div class="info-box">
            <p><span class="label">Message:</span></p>
            <p style="white-space: pre-line; background: #fff; padding: 15px; border-radius: 5px; border: 1px solid #eee;">${contactData.message}</p>
          </div>

          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Review the message details above</li>
            <li>Respond to the customer within 24 hours</li>
            <li>Update the contact status in the admin panel</li>
            <li>Mark as resolved once the issue is addressed</li>
          </ul>

          <p><em>This is an automated notification from your Real Estate Platform.</em></p>
        </div>
        <div class="footer">
          <p>© 2024 Real Estate Platform. All rights reserved.</p>
          <p>This notification was sent to your admin email address.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send to admin email
  await sendEmail({
    email: process.env.EMAIL_FROM || process.env.EMAIL_USER!,
    subject: `New Contact Form: ${contactData.subject}`,
    message,
  });
};

// Send contact confirmation to user
export const sendContactConfirmation = async (
  userEmail: string,
  userName: string,
  contactId: string
): Promise<void> => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Contact Form Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
        .success-box { background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Message Received!</h1>
        </div>
        <div class="content">
          <div class="success-box">
            <h3>Thank you for contacting us, ${userName}!</h3>
            <p>Your message has been successfully received. We've assigned it reference number: <strong>${contactId}</strong></p>
          </div>

          <p><strong>What happens next:</strong></p>
          <ul>
            <li>Our team will review your message</li>
            <li>We'll respond within 24 hours</li>
            <li>You can reference this email for follow-up inquiries</li>
          </ul>

          <p><strong>Your message:</strong></p>
          <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
            We've received your inquiry and will get back to you soon. Thank you for choosing our real estate services!
          </p>

          <p>If you have any urgent questions, please don't hesitate to call us at <strong>+1 (408) 555-0120</strong>.</p>

          <p>Thank you for choosing our real estate services!</p>
        </div>
        <div class="footer">
          <p>© 2024 Real Estate Platform. All rights reserved.</p>
          <p>You're receiving this email because you submitted a contact form on our website.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: userEmail,
    subject: 'Contact Form Received - We\'ll Be In Touch!',
    message,
  });
};
