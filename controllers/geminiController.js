import { getTenantDB } from '../config/dbManager.js';
import emailHistorySchema from '../models/EmailHistory.js';
import { GeminisendEmail } from "../utils/emailSendGemini.js";
import fs from "fs";


export const renderSendGeminiEmail = (req, res) => {
  const success = req.query.success || "";
  const error = req.query.error || "";

  res.render("gemini", {
    user: req.user,
    goal: "",
    subject: "",
    generatedEmail: "",
    success,
    error,
  });
};



export const getEmailHistory = async (req, res) => {
  try {
    const adminId = req.user?.adminId; // Assuming token includes adminId
    if (!adminId) {
      return res.status(400).json({ success: false, message: 'Admin ID missing in token' });
    }

    const tenantDB = getTenantDB(adminId);
    const EmailHistory = tenantDB.model('EmailHistory', emailHistorySchema);

    // Optional query filters for status or date range
    const { status, from, to, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (from || to) {
      filter.sentAt = {};
      if (from) filter.sentAt.$gte = new Date(from);
      if (to) filter.sentAt.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    // Fetching the email history data from the DB
    const history = await EmailHistory.find(filter)
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v'); // Hide the version field

    const total = await EmailHistory.countDocuments(filter);

    // Render the emailHistory.ejs page and pass the history data
    res.render('emailHistory', {
      title: 'Email Send History',
      emails: history,
      admin: req.user,
      total,
      page: Number(page),
      pageSize: history.length,
    });

  } catch (err) {
    console.error("Error fetching email history:", err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch email history' });
  }
};





export const sendGeminiFinalEmail = async (req, res) => {
  const { email, subject, body } = req.body;
  const user = req.user;
  const pdfFile = req.file;

  try {
    const attachment = pdfFile
      ? {
          filename: pdfFile.originalname,
          path: pdfFile.path,
          contentType: "application/pdf"
        }
      : null;

    await GeminisendEmail({
      to: email,
      subject,
      body,
      userId: user._id,
      adminId: user.adminId,
      attachment, // ✅ pass to email service
    });

    // Optional cleanup
    if (pdfFile) fs.unlinkSync(pdfFile.path);

    res.render("gemini", {
      user,
      to: "",
      subject: "",
      goal: "",
      generatedEmail: "",
      success: "✅ Email sent successfully with attachment!",
      error: null
    });
  } catch (error) {
    console.error("Send Email Error:", error.message);
    res.render("gemini", {
      user,
      to: email,
      subject,
      goal: "",
      generatedEmail: body,
      success: null,
      error: "❌ Failed to send email."
    });
  }
};
