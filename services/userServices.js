import bcrypt from 'bcryptjs';
import { getTenantDB } from '../config/dbManager.js';
import userSchema from '../models/userModel.js';

export const createUserInTenant = async (Id, userData) => {
  const conn = getTenantDB(Id);
  const UserModel = conn.model('User', userSchema);

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new UserModel({
    ...userData,
    password: hashedPassword,
    adminId: Id
  });

  return await user.save();
};

export const getAllUsers = async (Id) => {
  const conn = getTenantDB(Id);
  const UserModel = conn.model('User', userSchema);
  return await UserModel.find({}, { password: 0 }); 
};



