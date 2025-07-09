// config/dbConnect.js
import mongoose from 'mongoose';
import responseMessages from '../utils/responseMessages.js';

const connectMainDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Main DB Connected');
  } catch (err) {
    console.error(' Main DB connection failed:', responseMessages.INTERNAL_SERVER_ERROR );
  }
};

export default connectMainDB;
