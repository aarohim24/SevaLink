// app/api/gemini/extract-need/route.js
// Gemini "Speak Your Need" — converts raw field text into structured need data
import { getGeminiModel } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { rawText } = await request.json();
    if (!rawText || rawText.trim().length < 10) {
      return NextResponse.json({ error: 'Please provide a description of at least 10 characters.' }, { status: 400 });
    }

    const model = getGeminiModel('gemini-2.5-flash');

    const prompt = `You are an AI assistant for an NGO volunteer coordination platform in India.
A field worker has described a community need in plain language. Extract the structured data from it.

Field worker's description:
"${rawText}"

Return ONLY a valid JSON object with exactly these fields (no markdown, no explanation):
{
  "title": "concise need title (max 10 words)",
  "category": "one of: Food Security, Healthcare, Education, Housing, Water & Sanitation, Mental Health, Livelihood, Elder Care",
  "location": "specific location mentioned or empty string",
  "urgency": number from 1 (minimal) to 5 (critical),
  "skillsRequired": ["array", "of", "skills", "from: medical, nursing, first aid, teaching, counseling, logistics, driving, communication, construction, cooking, caregiving, psychology, carpentry, physical labor, sewing, crafts"],
  "volunteersNeeded": estimated number of volunteers needed (integer),
  "description": "cleaned, professional description of the need in 2-3 sentences"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if present
    const clean = text.replace(/^```json\n?/i, '').replace(/\n?```$/i, '').trim();
    const structured = JSON.parse(clean);

    // Validate and sanitise
    const categories = ['Food Security', 'Healthcare', 'Education', 'Housing', 'Water & Sanitation', 'Mental Health', 'Livelihood', 'Elder Care'];
    if (!categories.includes(structured.category)) structured.category = 'Food Security';
    if (typeof structured.urgency !== 'number') structured.urgency = 3;
    structured.urgency = Math.min(5, Math.max(1, Math.round(structured.urgency)));
    if (!Array.isArray(structured.skillsRequired)) structured.skillsRequired = [];
    structured.volunteersNeeded = Math.max(1, Math.round(structured.volunteersNeeded || 1));

    return NextResponse.json({ success: true, data: structured });
  } catch (err) {
    console.error('Gemini extract-need error:', err);
    return NextResponse.json({
      error: 'Failed to extract need. Please try again or fill the form manually.',
      debug: err?.message || String(err),
    }, { status: 500 });
  }
}
