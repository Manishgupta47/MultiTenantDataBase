import express from 'express';
import {  verifyOtpAndResetPassword, renderUserForgotPasswordPage, renderForgotPasswordPage,  forgotPassword, renderResetByOtpPage, renderUserResetByOtpPage,  userSendOtp, verifyUserOtpAndResetPassword } from "../controllers/authController.js";
import { renderAdminWelcome } from '../controllers/adminController.js';
const router = express.Router();
router.get('/', renderAdminWelcome); 
router.get('/admin-forgot-password', renderForgotPasswordPage);
router.post('/admin-forgot-password', forgotPassword); 
router.get('/admin-verify-otp', renderResetByOtpPage); 
router.post('/admin-verify-otp', verifyOtpAndResetPassword);
router.get('/user-forgot-password', renderUserForgotPasswordPage);
router.post('/user-forgot-password', userSendOtp); 
router.get('/user-verify-otp', renderUserResetByOtpPage); 
router.post('/user-verify-otp', verifyUserOtpAndResetPassword );



export default router;
