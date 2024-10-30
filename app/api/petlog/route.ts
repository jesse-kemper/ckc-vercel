import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  try {
    const log = await prisma.petLog.create({
      data: {
        petName: data.petName,
        roomNumber: data.roomNumber,
        date: data.date,
        elimination: data.elimination,
        consumption: data.consumption,
        medication: data.medication,
        gcu: data.gcu,
        tmInitials: data.tmInitials,
        smellDirty: data.smellDirty === "Yes",
        pawsSoiled: data.pawsSoiled === "Yes",
        bodySoiled: data.bodySoiled === "Yes",
        oilyDirty: data.oilyDirty === "Yes",
        petType: data.petType,
        runnerInitials: data.runnerInitials,
        userId: session.user.id,  // Use the user ID from the session
        locationId: session.user.locationId,  // Include location ID if needed
      },
    });
    return NextResponse.json(log);
  } catch (error) {
    console.error("Error creating pet log:", error); // Log the error for debugging
    return NextResponse.json({ error: "Error creating log" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  if (!locationId) {
    return NextResponse.json({ error: "Location ID is required" }, { status: 400 });
  }

  try {
    const logs = await prisma.petLog.findMany({
      where: { locationId: parseInt(locationId) },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalLogs = await prisma.petLog.count({
      where: { locationId: parseInt(locationId) },
    });

    return NextResponse.json({ logs, totalLogs });
  } catch (error) {
    console.error("Error fetching logs:", error); // Log the error for debugging
    return NextResponse.json({ error: "Error fetching logs" }, { status: 500 });
  }
}
