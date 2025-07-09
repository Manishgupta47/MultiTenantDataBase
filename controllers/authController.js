import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/adminModel.js';
import { sendOtpEmail } from '../utils/sendOtpEmail.js';
import { createTenantDB } from '../services/adminServices.js';
import { getTenantDB } from '../config/dbManager.js';
import userSchema from '../models/userModel.js';



export const renderForgotPasswordPage = (req, res) => {
  res.render('forgotPassword', { error: null });
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.render('forgotPassword', { error: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetOtp = otp;
    admin.otpExpiry = new Date(Date.now() + 15 * 60 * 1000); 
    await admin.save();

    await sendOtpEmail(email, otp);

    res.render('resetByOtp', {
      email,
      error: null,
      success: "OTP sent to your email"
    });
  } catch (err) {
    console.error("Password reset request error:", err);
    res.render('forgotPassword', { error: "Server error, try again." });
  }
};

export const renderResetByOtpPage = (req, res) => {
  res.render('resetByOtp', { email: "", error: null, success: null });
};


export const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.resetOtp !== otp) {
      return res.render('resetByOtp', {
        email,
        error: "Invalid OTP",
        success: null
      });
    }

    if (admin.otpExpiry < Date.now()) {
      return res.render('resetByOtp', {
        email,
        error: "OTP expired",
        success: null
      });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    admin.resetOtp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();

    await createTenantDB(admin.Id);

    const token = jwt.sign({ id: admin._id, Id: admin.Id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

   
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect(`/admin/dashboard?Id=${admin.Id}&success=Password reset successful`);
  } catch (err) {
    console.error("OTP verification error:", err);
    res.render('resetByOtp', {
      email,
      error: "Server error",
      success: null
    });
  }
};

export const renderUserForgotPasswordPage = (req, res) => {
  res.render('userForgotPassword', { error: null });
};


export const userSendOtp = async (req, res) => {
  const { email, adminId } = req.body;

  if (!email || !adminId) {
    return res.render("userForgotPassword", { error: "Email and Admin ID are required." });
  }

  try {
    const db = getTenantDB(adminId);

  
    const UserModel = db.models.User || db.model("User", userSchema);

    const user = await UserModel.findOne({ email });

    if (!user) return res.render("userForgotPassword", { error: "Email not found." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    res.render("userResetByOtp", { email, adminId, success: "OTP sent to email" });

  } catch (err) {
    console.error("Error in userSendOtp:", err);
    res.render("userForgotPassword", { error: "Server error." });
  }
};

export const renderUserResetByOtpPage = (req, res) => {
  res.render('userResetByOtp', { email: "", error: null, success: null });
};



export const verifyUserOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.render("userResetByOtp", {
      error: "All fields are required.",
      email
    });
  }

  try {
   
    const admins = await Admin.find();
    let foundUser = null;
    let adminId = null;

    for (const admin of admins) {
      const db = getTenantDB(admin.Id);
      const UserModel = db.models.User || db.model("User", userSchema);
      const user = await UserModel.findOne({ email });

      if (user) {
        foundUser = user;
        adminId = admin.Id;
        break;
      }
    }

    if (!foundUser) {
      return res.render("userResetByOtp", {
        error: "User not found.",
        email
      });
    }

    if (
      !foundUser.resetOtp ||
      (foundUser.resetOtp + '').trim() !== (otp + '').trim()
    ) {
      return res.render("userResetByOtp", {
        error: "Invalid OTP",
        email
      });
    }

    if (foundUser.otpExpiry < Date.now()) {
      return res.render("userResetByOtp", {
        error: "OTP expired",
        email
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword;
    foundUser.resetOtp = undefined;
    foundUser.otpExpiry = undefined;
    await foundUser.save();


    const token = jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email,
        Id: adminId
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
// ...
res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


return res.render('userDashboard', {
  user: {
    name: user.name,
    email: user.email,
    mobileNo: user.mobileNo,
    role: user.role
  }
});

  } catch (err) {
    console.error("User OTP verification error:", err);
    return res.render("userResetByOtp", {
      error: "Server error",
      email
    });
  }
};



 