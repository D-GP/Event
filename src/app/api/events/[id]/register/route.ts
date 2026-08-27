import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const { email, name } = await req.json();

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, role: 'ATTENDEE' }
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
      return NextResponse.json({ success: false, error: 'Already registered for this event.' }, { status: 400 });
    }

    const registration = await prisma.registration.create({
      data: {
        userId: user.id,
        eventId: eventId
      }
    });

    return NextResponse.json({ success: true, registration });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
