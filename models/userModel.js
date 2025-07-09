
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNo: { type: String, required: true },
  adminId: { type: String },
  role: { type: String, required: true, default: "user" },
  resetOtp: { type: String },
  otpExpiry: { type: String },


  smtp: {
    email: { type: String },
    appPassword: { type: String }
  }
}, {
  timestamps: true
});

export default userSchema;




