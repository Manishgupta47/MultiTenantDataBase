
import responseMessages from '../utils/responseMessages.js';
import { createAdminInMainDB, findAdminByEmail, createTenantDB } from '../services/adminServices.js';
import { getAllUsers } from '../services/userServices.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


export const renderAdminRegister = (req, res) => {
  res.render('adminRegister'); 
};
 
export const renderAdminWelcome = (req, res) => {
  res.render('authWelcome'); 
};

export const renderAdminLogin = (req, res) => {
  res.render('adminLogin');
}; 

export const logoutAdmin = (req, res) => {
  res.clearCookie('token');
  res.render('adminLogin', {
    success: 'Admin logged out successfully',
    error: null,
  })
};


export const renderAdminDashboard = async (req, res) => {
  try {
    const adminData = req.admin; 
    const users = await getAllUsers(adminData.Id); 

    res.render('adminDashboard', { adminData, users, success: req.query.success });
  } catch (err) {
    console.error("Dashboard error:", responseMessages.INTERNAL_SERVER_ERROR);
    res.status(500).send('Failed to load dashboard');
  }
};


export const registerAdmin = async (req, res) => {
  const { success, error } = req.query
  try {
    const adminData = req.body;
    const newAdmin = await createAdminInMainDB(adminData);
   
    res.render('adminLogin', { success: 'Admin registered successfully', error: null });
  } catch (error) {
    res.render('adminRegister', {
      success: null,
      error: "Already registered with this email",
      
      
    });
  };
  
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return   res.render("adminLogin", {
        error: "Email And Password are Required",
        success: null
      });
    }

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return   res.render("adminLogin", {
        error: "Incorrect Email ",
        success: null
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render("adminLogin", {
        error: "Incorrect password",
        success: null
      });
    }

    await createTenantDB(admin.Id);

    const token = jwt.sign({ id: admin._id, Id: admin.Id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(`/admin/dashboard?Id=${admin.Id}&success=Admin logged in successfully`);
  } catch (err) {
    return res.render("adminLogin", {
      error:  responseMessages.ADMIN_LOGIN_FAILED, 
      success: null
    });
  }
};








