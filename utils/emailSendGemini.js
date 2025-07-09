
import nodemailer from "nodemailer";
import { getTenantDB } from "../config/dbManager.js";
import userSchema from "../models/userModel.js";

export const GeminisendEmail = async ({ to, subject, body, userId, adminId }) => {
  if (!adminId) throw new Error("adminId is missing");
 

  const tenantDB = getTenantDB(adminId); 
  const UserModel = tenantDB.model('User', userSchema);
 

  const user = await UserModel.findById(userId); 
  if (!user || !user.smtp?.email || !user.smtp?.appPassword) {
   
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

  await transporter.sendMail({
    from: user.smtp.email,
    to,
    subject,
    html:  `<pre style="font-family: monospace; white-space: pre-wrap;">${body}</pre>`
  });
};










