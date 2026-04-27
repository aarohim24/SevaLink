// lib/gemini.js — shared Gemini client (lazy init so env var is always available)
import { GoogleGenerativeAI } from '@google/generative-ai';

export function getGeminiModel(modelName = 'gemini-1.5-flash-latest') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}
