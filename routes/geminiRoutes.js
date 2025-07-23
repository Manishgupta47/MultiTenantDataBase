import express from "express";
import { getEmailHistory, renderSendGeminiEmail, sendGeminiFinalEmail} from "../controllers/geminiController.js";
import { isUser } from "../middlewares/auth.js";
import { saveSMTPSettings } from "../controllers/saveSMTPController.js";
import { streamEmail } from "../controllers/streamController.js";import multer from "multer";



const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get("/generate-email", isUser, renderSendGeminiEmail)
router.get("/stream", isUser, streamEmail);
 router.post('/send', isUser, upload.single('pdf'), sendGeminiFinalEmail); 
router.post('/save-smtp', isUser, saveSMTPSettings);
router.get('/history', isUser, getEmailHistory);

export default router;







