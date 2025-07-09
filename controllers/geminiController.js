
import { GeminisendEmail } from "../utils/emailSendGemini.js";


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




export const sendGeminiFinalEmail = async (req, res) => {
  const { email, subject, body } = req.body;
  const user = req.user;

  try {
    await GeminisendEmail({
      to: email,
      subject,
      body,
      userId: user._id,
      adminId: user.adminId
    });

    res.render("gemini", {
      user,
      to: "",
      subject: "",
      goal: "",
      generatedEmail: "",
      success: " Email sent successfully!",
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
      error: " Failed to send email."
    });
  }
};

