import mongoose from 'mongoose';

const emailHistorySchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String },
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  error: { type: String, default: null },
  sentAt: { type: Date, default: Date.now },
});

export default emailHistorySchema;
