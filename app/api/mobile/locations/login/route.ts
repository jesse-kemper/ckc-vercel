import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Find the location by email
  const location = await prisma.location.findFirst({
    where: { email },
  });

  if (!location || !location.password) {
    console.log("NO password set or location not found");
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Compare passwords
  const isValid = await compare(password, location.password);

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Generate JWT token
  const token = jwt.sign(
    { locationId: location.id, centerId: location.centerId },
    process.env.JWT_SECRET!,
    { expiresIn: '48h' }
  );

  return NextResponse.json({ token });
}
