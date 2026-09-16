import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, date, location } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Event title is required.' }, { status: 400 });
    }
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Event description is required.' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ success: false, error: 'Event date is required.' }, { status: 400 });
    }
    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Event location is required.' }, { status: 400 });
    }

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid date format.' }, { status: 400 });
    }

    // Find or create a default organizer
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
        title: title.trim(),
        description: description.trim(),
        date: parsedDate,
        location: location.trim(),
        organizerId: user.id
      }
    });

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create event' }, { status: 500 });
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
    console.error('Fetch events error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch events' }, { status: 500 });
  }
}
