import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, 
  service: "gmail",
  auth: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email, password, adminId) => {
  const mailOptions = { 
    from: process.env.EMAIL_USER, 
    to: email,
    subject: "🛡️ Welcome to the MultiDataBase – Your Login Details",
    html: `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 24px; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Welcome to the Platform 🎉</h2>
    <p style="font-size: 16px; color: #444;">Here are your login credentials:</p>

    <table style="width: 100%; margin: 16px 0; font-size: 15px;">
      <tr>
        <td style="padding: 8px 0; color: #555;"><strong>Email:</strong></td>
        <td style="padding: 8px 0;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #555;"><strong>Password:</strong></td>
        <td style="padding: 8px 0;">${password}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #555;"><strong>Admin ID:</strong></td>
        <td style="padding: 8px 0;">${adminId}</td>
      </tr>
    </table>

    <p style="font-size: 15px; color: #444;">Use these credentials to log in and get started.</p>

    <div style="margin-top: 24px; font-size: 14px; color: #999;">
      <hr style="border: none; border-top: 1px solid #ddd;" />
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(` Email sent to email`);
  } catch (err) {
    console.error(" Error sending email:", err.message);
  }
};
