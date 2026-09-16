import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, keywords } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Event title is required.' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY is not configured. Please add it to your .env file.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Act as an expert event copywriter. Write a compelling, engaging, and professional description for an event.
      Event Title: ${title.trim()}
      Keywords/Themes: ${keywords || 'general'}
      
      Keep the description around 2-3 paragraphs. Make it exciting and encourage people to register. Do not include placeholders like [Date] or [Location], just focus on the event's value proposition.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, description: text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate description' },
      { status: 500 }
    );
  }
}
