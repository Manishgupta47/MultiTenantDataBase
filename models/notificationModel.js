import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  email: { type: String, default: null },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default notificationSchema;
