import nodemailer from "nodemailer";
import { getTenantDB } from "../config/dbManager.js";
import userSchema from "../models/userModel.js";
import emailHistorySchema from "../models/EmailHistory.js";

export const GeminisendEmail = async ({ to, subject, body, userId, adminId, attachment }) => {
  if (!adminId) throw new Error("adminId is missing");

  const tenantDB = getTenantDB(adminId); 
  const UserModel = tenantDB.model('User', userSchema);
  const EmailHistory = tenantDB.model('EmailHistory', emailHistorySchema);

  const user = await UserModel.findById(userId); 
  if (!user || !user.smtp?.email || !user.smtp?.appPassword) {
    await EmailHistory.create({
      from: user?.smtp?.email || 'unknown',
      to,
      subject,
      body,
      status: 'failed',
      error: "SMTP credentials not found",
      sentAt: new Date()
    });
    throw new Error("SMTP credentials not found");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 465,
    secure: true,
    auth: {
      user: user.smtp.email,
      pass: user.smtp.appPassword
    }
  });

  const mailOptions = {
    from: user.smtp.email,
    to,
    subject,
    html: `
      <div style="font-family:'Segoe UI', sans-serif; line-height:1.6; font-size:15px; padding:10px;">
        ${body.replace(/\n/g, "<br/>")}
      </div>
    `,
    ...(attachment ? { attachments: [attachment] } : {})
  };

  try {
    await transporter.sendMail(mailOptions);

    await EmailHistory.create({
      from: user.smtp.email,
      to,
      subject,
      body,
      status: 'sent',
      sentAt: new Date()
    });

  } catch (error) {
    await EmailHistory.create({
      from: user.smtp.email,
      to,
      subject,
      body,
      status: 'failed',
      error: error.message,
      sentAt: new Date()
    });

    throw new Error("Failed to send email: " + error.message);
  }
};
