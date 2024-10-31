import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/authOptions";
import prisma from "../../../prisma/prisma";
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
        ...data,
        userId: session.user.id,
      },
    });
    return NextResponse.json(log);
  } catch (error) {
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
    return NextResponse.json({ error: "Error fetching logs" }, { status: 500 });
  }
}
