// app/api/gemini/impact-digest/route.js
// Gemini Impact Digest — generates a donor-ready weekly summary paragraph for an NGO
import { getGeminiModel } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { ngoName, needsResolved, volunteersDeployed, peopleReached, topCategories } = await request.json();

    const model = getGeminiModel('gemini-1.5-flash');

    const prompt = `You are writing a concise, warm, and professional impact summary for a donor report.

NGO: ${ngoName}
This week's data:
- Needs resolved: ${needsResolved}
- Volunteers deployed: ${volunteersDeployed}
- People reached: ${peopleReached}
- Top categories: ${topCategories?.join(', ')}

Write exactly 2 sentences — one highlighting the impact and one thanking the volunteers. Be specific, warm but professional. No emojis. Return only the 2 sentences.`;

    const result = await model.generateContent(prompt);
    const digest = result.response.text().trim();

    return NextResponse.json({ success: true, digest });
  } catch (err) {
    console.error('Gemini impact-digest error:', err);
    return NextResponse.json({ success: false, digest: 'Your NGO made a meaningful difference this week. Thank you to all volunteers who gave their time.' });
  }
}
