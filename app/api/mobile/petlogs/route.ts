import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  // Get the authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { locationId, centerId } = decodedToken;

  const data = await req.json();

  // Validate required fields
  const {
    petName,
    roomNumber,
    date,
    elimination,
    consumption,
    medication,
    gcu,
    tmInitials,
    smellDirty,
    pawsSoiled,
    bodySoiled,
    oilyDirty,
    petType,
    petReservationId,
  } = data;

  // Perform any necessary validation here

  // Create the pet log
  const petLog = await prisma.petLog.create({
    data: {
      petName,
      roomNumber,
      date: new Date(date),
      elimination,
      consumption,
      medication,
      gcu,
      tmInitials,
      smellDirty,
      pawsSoiled,
      bodySoiled,
      oilyDirty,
      petType,
      petReservationId,
      centerId: parseInt(locationId), // Assuming locationId is an integer
    },
  });

  return NextResponse.json({ petLog });
}
