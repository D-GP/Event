import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
// Make sure to add GEMINI_API_KEY to your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { title, keywords } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Act as an expert event copywriter. Write a compelling, engaging, and professional description for an event.
      Event Title: ${title}
      Keywords/Themes: ${keywords}
      
      Keep the description around 2-3 paragraphs. Make it exciting and encourage people to register. Do not include placeholders like [Date] or [Location], just focus on the event's value proposition.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, description: text });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
