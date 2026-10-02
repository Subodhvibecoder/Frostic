/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Shared Gemini client setup (with User-Agent tracking for AI Studio telemetry)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Proxy route for Gemini AI
app.post('/api/gemini/chat', async (req, res) => {
  const { prompt, systemInstruction, context } = req.body;
  const customKey = req.headers['x-gemini-key'] as string;
  const activeKey = customKey || process.env.GEMINI_API_KEY;
  
  if (!activeKey) {
    // Return a flag indicating fallback is active due to missing key
    return res.status(200).json({
      text: null,
      error: "API_KEY_MISSING",
      message: "Vite is running in local sandbox. Defaulting to local Frostic high-integrity intelligence model."
    });
  }

  try {
    const contextPrompt = context 
      ? `Active Website Data Context:\n${JSON.stringify(context, null, 2)}\n\nUser Query: ${prompt}`
      : prompt;

    // Dynamically initialize client based on active key
    const dynamicAi = new GoogleGenAI({
      apiKey: activeKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await dynamicAi.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contextPrompt,
      config: {
        systemInstruction: systemInstruction || "You are Frostic AI, an expert enterprise financial advisor. Provide detailed insights with clean formatting."
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to contact Gemini API." });
  }
});

// Full-Stack integrations mount in dev mode
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Frostic Server running at http://localhost:${PORT}`);
});
