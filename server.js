import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import connectMainDB from './config/dbConnect.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';



dotenv.config();
const app = express();
app.use(cookieParser());



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 


connectMainDB();
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/', authRoutes);
app.use('/email', geminiRoutes);





const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

