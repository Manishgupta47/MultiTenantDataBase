
import bcrypt from 'bcryptjs';
import AdminModel from '../models/adminModel.js';
import { getTenantDB } from '../config/dbManager.js';
import { generateFioId } from '../utils/idGenerator.js';
import responseMessages from '../utils/responseMessages.js';


export const createAdminInMainDB = async (adminData) => {
  try {
   
    const { name, email, password, mobileNo } = adminData;
    if (!name || !email || !password || !mobileNo) {
      throw new Error("All fields are required");
    }

    const existing = await AdminModel.findOne({ email });
    if (existing) {
      return res.render("adminRegister", {
        error: "Email already registered. Please login or use another email.",
        success: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const Id = generateFioId();

    const admin = new AdminModel({
      ...adminData,
      password: hashedPassword,
      Id
    });

    const savedAdmin = await admin.save();
    return savedAdmin;

  } catch (error) {
    throw new Error( "Failed to register admin");
  }
};


export const findAdminByEmail = async (email) => {
  try {
    return await AdminModel.findOne({ email });
  } catch (err) {
    throw new Error("Error fetching admin by email");
  }
};



export const createTenantDB = async (Id) => {
  try {
    const conn = getTenantDB(Id);

    if (conn.models && Object.keys(conn.models).length > 0) {
      return; 
    }

    console.log(`Tenant DB ready: admin${Id}`);

  } catch (error) {
    console.error(" Error creating tenant DB:", responseMessages.INTERNAL_SERVER_ERROR);
    throw new Error("Tenant DB creation failed");
  }
};
