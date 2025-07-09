import { GoogleGenerativeAI } from "@google/generative-ai";
import responseMessages from "../utils/responseMessages.js";
import dotenv from "dotenv";
dotenv.config();

export const streamEmail = async (req, res) => {
  const { goal, tone } = req.query;

  if (!goal || !tone) {
    return res.status(400).send("Missing goal or tone in query");
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a professional email writer.

The email should follow this format:

Subject: <generated subject>

Dear [Recipient Name],

<Email body in 2-3 paragraphs>

Regards,  
[Sender Name]

Write the email in a ${tone} tone. The goal is:
"${goal}"

Return only email content. No extra explanation.
    `;

    const result = await model.generateContentStream(prompt);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let subjectSent = false;

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (!text) continue;

      if (!subjectSent && text.includes("Subject:")) {
        const match = text.match(/Subject:\s*(.+)/);
        if (match) {
          res.write(`event: subject\ndata: ${match[1]}\n\n`);
          subjectSent = true;
        }
      }
      

      res.write(`data: ${text}\n\n`);
    }

   
    res.write(`event: done\ndata: Done\n\n`);
    res.end();

  } catch (error) {
    res.write(`data: Error: ${responseMessages.INTERNAL_SERVER_ERROR}\n\n`);
    res.end();
  }
};






