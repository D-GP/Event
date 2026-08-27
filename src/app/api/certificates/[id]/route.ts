import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const registrationId = params.id;
    
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { user: true, event: true }
    });

    if (!registration) {
      return NextResponse.json({ success: false, error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, registration });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
