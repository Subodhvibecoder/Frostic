/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, systemInstruction, context } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      text: null,
      error: "API_KEY_MISSING",
      message: "Vercel is running in sandbox mode. Defaulting to local Frostic high-integrity intelligence model."
    });
  }

  try {
    const contextPrompt = context 
      ? `Active Website Data Context:\n${JSON.stringify(context, null, 2)}\n\nUser Query: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contextPrompt,
      config: {
        systemInstruction: systemInstruction || "You are Frostic AI, an expert enterprise financial advisor. Provide detailed insights with clean formatting."
      }
    });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message || "Failed to contact Gemini API." });
  }
}
