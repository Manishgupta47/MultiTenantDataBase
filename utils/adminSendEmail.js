import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "manishg2872@gmail.com",  // Your Gmail address
    pass: "ljbj idam rrsv ylyj"   // Your Gmail App Password
  }
});

export const sendNotificationEmail = async (user) => {
    if (!user || !user.email) {
        throw new Error("User email is missing.");
    }
  const mailOptions = {
    from: `"Your Company" <${"manishg2872@gmail.com"}>`,
    to: user.email,
    subject: "🔔 New Notification Received",
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); color: #333;">
    <h2 style="color: #007bff;">Hello ${user.name || 'User'},</h2>
    
    <p style="font-size: 16px; line-height: 1.6;">
      You have received a new <strong>notification</strong> on your portal.
    </p>
    
    <p style="font-size: 16px; line-height: 1.6;">
      Please click the button below to log in and check it:
    </p>
  
    <div style="margin: 30px 0; text-align: center;">
      <a href="http://localhost:5000/user/login"
         style="background: #007bff; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
        🔓 Login to Portal
      </a>
    </div>
  
    <p style="font-size: 14px; color: #666;">
      If you didn’t request this, please ignore this email.
    </p>
  
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
    <p style="font-size: 14px; color: #999;">
      Regards,<br>
      <strong>Admin Team</strong>
    </p>
  </div>
  
    `
  };

  await transporter.sendMail(mailOptions);
};

