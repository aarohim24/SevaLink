// app/api/gemini/explain-match/route.js
// Gemini Match Explainer — generates a natural language explanation for each volunteer match
import { getGeminiModel } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { volunteer, need, score } = await request.json();

    const model = getGeminiModel('gemini-1.5-flash-latest');

    const skillOverlap = (volunteer.skills || []).filter(s => (need.skillsRequired || []).includes(s));
    const sameDistrict = volunteer.district === need.district;

    const prompt = `You are an AI assistant for a volunteer coordination platform.
Generate a single, concise, warm sentence (max 25 words) explaining why this volunteer is a good match for this community need.

Volunteer: ${volunteer.name}, skills: ${volunteer.skills?.join(', ')}, district: ${volunteer.district}, availability: ${volunteer.availability}
Need: "${need.title}" in ${need.location}, requires: ${need.skillsRequired?.join(', ')}, urgency: ${need.urgency}/5
Match score: ${Math.round(score * 100)}%
Matching skills: ${skillOverlap.join(', ') || 'general skills'}
Same district: ${sameDistrict}

Return ONLY the sentence, no quotes, no punctuation at the end.`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text().trim().replace(/^["']|["']$/g, '');

    return NextResponse.json({ success: true, explanation });
  } catch (err) {
    console.error('Gemini explain-match error:', err);
    return NextResponse.json({ success: false, explanation: 'Strong skill and location match for this need.' });
  }
}
