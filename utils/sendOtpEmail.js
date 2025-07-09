import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true, 
  service: 'gmail',
  auth: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASS,
  
  },
});

export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP to reset password',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="text-align: center; color: #333;">MultiDataBase Admin Password Reset</h2>
    <p style="font-size: 16px; color: #444;">
      You requested to reset your password. Use the OTP below to proceed. This OTP is valid for <strong>15 minutes</strong>.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="display: inline-block; background: #007BFF; color: white; font-size: 24px; padding: 12px 24px; border-radius: 6px; letter-spacing: 4px;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 14px; color: #777;">
      If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.
    </p>

    <hr style="margin-top: 40px;" />
    <p style="font-size: 12px; color: #999; text-align: center;">
      &copy; ${new Date().getFullYear()}  MultiDataBase Admin System. All rights reserved.
    </p>
  </div>`,
  };

  await transporter.sendMail(mailOptions);
};
