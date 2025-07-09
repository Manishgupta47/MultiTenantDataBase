import express from "express";
import { renderSendGeminiEmail, sendGeminiFinalEmail} from "../controllers/geminiController.js";
import { isUser } from "../middlewares/auth.js";
import { saveSMTPSettings } from "../controllers/saveSMTPController.js";
import { streamEmail } from "../controllers/streamController.js";

const router = express.Router();

router.get("/generate-email", isUser, renderSendGeminiEmail)
router.get("/stream", isUser, streamEmail);
 router.post('/send', isUser, sendGeminiFinalEmail); 
router.post('/save-smtp', isUser, saveSMTPSettings);

export default router;







