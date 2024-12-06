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

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build the where condition
    const whereConditions: any = {
      centerId: parseInt(centerId),
    };

    // Add search filter
    if (search) {
      whereConditions.OR = [
        { petReservationId: { contains: search, mode: 'insensitive' } },
        { petName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add date range filter
    if (startDate || endDate) {
      whereConditions.date = {};
      if (startDate) whereConditions.date.gte = new Date(startDate);
      if (endDate) whereConditions.date.lte = new Date(endDate);
    }

    // Fetch logs with pagination and filtering
    const logs = await prisma.petLog.findMany({
      where: whereConditions,
      orderBy: { createdAt: 'desc' }, // Sort logs by the creation date in descending order
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Count total logs for pagination metadata
    const totalLogs = await prisma.petLog.count({ where: whereConditions });

    return NextResponse.json({ logs, totalLogs, page, pageSize });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
        centerId: parseInt(centerId), // Assuming centerId is an integer
      },
    });

    return NextResponse.json({ petLog });
  } catch (error) {
    console.error('Error creating pet log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
