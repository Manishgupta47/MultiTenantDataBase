import responseMessages from '../utils/responseMessages.js';
import { createUserInTenant, getAllUsers } from '../services/userServices.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getTenantDB } from '../config/dbManager.js';
import userSchema from '../models/userModel.js';
import { sendWelcomeEmail } from '../utils/sendEmail.js'; 
import notificationSchema from "../models/notificationModel.js"; 


export const renderUserCreatePage = (req, res) => {
  const adminId = req.query.adminId;
  res.render('partials/userCreate', { adminId });
};

export const renderUserLoginPage = (req, res) => {
  res.render('partials/userLogin', { success: req.query.success || null });
};

export const renderAllUsersPage = async (req, res) => {
  try {
    const adminId = req.query.Id || req.query.adminId;
    const users = await getAllUsers(adminId);
    res.render('partials/userTable', {
      users,
      success: req.query.success || null,
      adminId,
    });
  } catch (err) {
    res.render('partials/userTable', {
      users: [],
      success: "Failed to load users",
      adminId: null
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const adminId = req.body.Id; 
    const { name, email, password, mobileNo } = req.body;

    if (!name || !email || !password || !mobileNo || !adminId) {
      res.render('userCreate', {
        success: null,
        error: "All fields are required",
      });
    }

    const userData = { name, email, password, mobileNo };
    const user = await createUserInTenant(adminId, userData);

   
    await sendWelcomeEmail(email, password, adminId);

   res.redirect(`/user/login?success=User created successfully&Id=${adminId}`);
  } catch (err) {
    console.error(" Error in createUser:", responseMessages.INTERNAL_SERVER_ERROR);
    res.render('userCreate', {
      success: null,
      error: "Failed to create user",
    });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password, Id } = req.body;

    if (!email || !password || !Id) {
      res.render('userLogin', {
        success: null,
        error: "All fields are required",
      });
    }

    const tenantDB = getTenantDB(Id);
    const UserModel = tenantDB.model('User', userSchema);
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.render('userLogin', {
        success: null,
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.render('userLogin', {
        success: null,
        error: "Invalid password",
      });
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      name: user.name,
      adminId: user.adminId
    }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

  
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

   
    res.redirect('/email/generate-email?success=Login successful');

  } catch (error) {
    console.error("Login Error:", error);
    return res.redirect(`/user/login?error=Server error. Please try again later`);
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/user/login?success=Logged out successfully');
};



export const getUserNotifications = async (req, res) => {
  const { email, adminId } = req.user; 

  const db = getTenantDB(adminId);
  const Notification = db.model("Notification", notificationSchema);

  try {
    const notifications = await Notification.find({
      $or: [
        { email: null },
        { email: email } 
      ]
    }).sort({ createdAt: -1 });

    const formattedNotifications = notifications.map(n => ({
      ...n.toObject(),
      formattedDate: new Date(n.createdAt).toLocaleString()
    }));

    res.render("userNotifications", {
      notifications: formattedNotifications,
      unreadCount: notifications.filter(n => !n.isRead).length,
      user: req.user
    });

  } catch (err) {
    console.error("Error fetching notifications:");
    res.status(500).send("Error fetching notifications");
  }
};


