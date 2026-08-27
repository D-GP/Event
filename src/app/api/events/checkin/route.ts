import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { registrationId } = await req.json();

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { user: true, event: true }
    });

    if (!registration) {
      return NextResponse.json({ success: false, error: 'Registration not found (Invalid QR)' }, { status: 404 });
    }

    if (registration.checkedIn) {
      return NextResponse.json({ success: true, message: 'Already checked in', registration });
    }

    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: { checkedIn: true },
      include: { user: true, event: true }
    });

    return NextResponse.json({ success: true, message: 'Check-in successful!', registration: updated });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
