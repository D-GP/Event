import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: eventId } = await params;
    const body = await req.json();
    const { email, name } = body;

    // Validate inputs
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Your name is required.' }, { status: 400 });
    }

    // Verify event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found.' }, { status: 404 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: email.toLowerCase().trim(), name: name.trim(), role: 'ATTENDEE' }
      });
    }

    // Check if already registered
    const existing = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: eventId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'You are already registered for this event.' }, { status: 400 });
    }

    const registration = await prisma.registration.create({
      data: {
        userId: user.id,
        eventId: eventId
      }
    });

    return NextResponse.json({ success: true, registration });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Registration failed' }, { status: 500 });
  }
}
