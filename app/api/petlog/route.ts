import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path to Prisma client

export async function POST(req: NextRequest) {
  try {
    const { userId, ...logData } = await req.json();

    // Retrieve the user's location ID from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { location: true },
    });

    if (!user || !user.location) {
      return NextResponse.json(
        { error: "User or location not found" },
        { status: 400 }
      );
    }

    // Create the new pet log entry in the database
    const petLog = await prisma.petLog.create({
      data: {
        ...logData,
        userId,
        locationId: user.location.id, // Set location based on user's location ID
        smellDirty: logData.smellDirty === "Yes",
        pawsSoiled: logData.pawsSoiled === "Yes",
        bodySoiled: logData.bodySoiled === "Yes",
        oilyDirty: logData.oilyDirty === "Yes",
      },
    });

    return NextResponse.json(petLog, { status: 200 });
  } catch (error) {
    console.error("Error creating pet log:", error);
    return NextResponse.json(
      { error: "Failed to create pet log" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");
  console.log("Location ID getting logs:", locationId);
  if (!locationId) {
    return NextResponse.json({ error: "Location ID is required" }, { status: 400 });
  }

  try {
    const petLogs = await prisma.petLog.findMany({
      where: { locationId: parseInt(locationId) },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(petLogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching pet logs:", error);
    return NextResponse.json({ error: "Failed to fetch pet logs" }, { status: 500 });
  }
}
