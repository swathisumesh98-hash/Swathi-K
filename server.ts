/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI client lazily on the server
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Go to Settings > Secrets in AI Studio to set it.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

app.use(express.json());

// API: AI Health Companion & Lab Interpreter
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
       res.status(400).json({ error: "Message content is required" });
       return;
    }

    const ai = getAiClient();

    // Setup clinical knowledge boundaries for appropriate guidance
    const systemInstruction = 
      "You are a clinical assistant for Madiyan Biotech Medical Center located in MK Complex, Madiyan, Manikoth. " +
      "Help users understand medical tests, standard preparing instructions (like fasting requirements for Lipid Profile or Glucose), ECG tests, nebulization purposes, " +
      "and general home sample collection queries. " +
      "Guidelines:\n" +
      "1. Be extremely reassuring, helpful, and scientific yet accessible.\n" +
      "2. Advise that and show that Madiyan Biotech is fully equipped to send clinical professionals home within Madiyan, Manikoth, and surrounding areas (Kanhangad region) for Home Sample Collection.\n" +
      "3. ALWAYS include a clear medical disclaimer: 'Madiyan Biotech AI Assistant provides informational guidance. Please consult with our certified medical laboratory technicians, pathologists, or your general practitioner for proper clinical diagnoses.'\n" +
      "4. Do not diagnose conditions directly, but explain what elevated or lower parameters means objectively (e.g. elevated WBC indicates body combating an infection; high Troponin indicates cardiac strain). " +
      "Keep answers concise (max 3 neat bullet points or paragraphs) and highly readable.";

    // Convert chat history format
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected issue occurred while calling the Gemini API. Please make sure GEMINI_API_KEY is configured in AI Studio Secrets." 
    });
  }
});

// Server configuration helper based on Node environment
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in Development Mode (with Vite Middleware)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in Production Mode (serving static dist)...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Madiyan Biotech Express Server running on http://localhost:${PORT}`);
  });
}

initServer().catch((e) => {
  console.error("Failed to bootstrap Madiyan Biotech server: ", e);
});
