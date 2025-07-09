import express from 'express';
import { createUser, getUserNotifications, loginUser, logoutUser } from '../controllers/userController.js';
import {  isAdmin, isUser } from '../middlewares/auth.js'; 
import { renderUserCreatePage, renderUserLoginPage, renderAllUsersPage } from '../controllers/userController.js';
import { markAsRead } from '../controllers/markController.js';

const router = express.Router();


router.get('/create', renderUserCreatePage);
router.post('/create', isAdmin, createUser);
router.get('/login', renderUserLoginPage);
router.post('/login',  loginUser);
router.get('/all', renderAllUsersPage); 
router.get('/logout', logoutUser);
router.get("/notifications", isUser, getUserNotifications);
router.post("/notifications/:id/read", isUser,  markAsRead);

  

export default router;