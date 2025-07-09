 import express from 'express';
 import {renderAdminLogin, renderAdminRegister, renderAdminWelcome, renderAdminDashboard, registerAdmin, logoutAdmin, loginAdmin} from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/auth.js';
import { deleteNotification, renderSendNotification,  sendNotification } from '../controllers/sendNotification.js';
 const router = express.Router(); 

  router.get('/home', renderAdminWelcome); 
  router.get('/register', renderAdminRegister) 
  router.post('/register', registerAdmin);

  router.get('/login', renderAdminLogin);
  router.post('/login', loginAdmin);

  router.get('/dashboard', isAdmin, renderAdminDashboard);
  router.get('/logout', logoutAdmin);
  router.get("/send-notification", isAdmin, renderSendNotification);
  router.post("/send-notification",isAdmin, sendNotification);
  router.post("/notifications/:id/delete", isAdmin, deleteNotification);

  
  export default router;
  

