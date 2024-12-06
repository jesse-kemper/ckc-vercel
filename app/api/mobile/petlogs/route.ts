import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract and verify the token
    const token = authHeader.split(' ')[1];
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Extract centerId from the decoded token
    const { centerId } = decodedToken;
    if (!centerId) {
      return NextResponse.json({ error: 'centerId is missing in the token' }, { status: 400 });
    }

    // Fetch logs from the database based on the centerId
    const logs = await prisma.petLog.findMany({
      where: { locationId: centerId },
      orderBy: { createdAt: 'desc' }, // Sort logs by the creation date in descending order
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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
