import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, description, date, location, organizerId } = await req.json();

    // In a real app with NextAuth, we would get the organizerId from the session.
    // For this demonstration, if no organizerId is passed, we'll create a default one or just use a dummy one.
    
    let user = await prisma.user.findFirst({ where: { role: 'ORGANIZER' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@eventplatform.com',
          name: 'Default Organizer',
          role: 'ORGANIZER'
        }
      });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        organizerId: user.id
      }
    });

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: { _count: { select: { registrations: true } } }
    });
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
