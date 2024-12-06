import { getServerSession } from "next-auth/next"; // Ensure correct import path
import { authOptions } from "@/lib/authOptions"; // Update the import path based on your project structure
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions); // Pass the `authOptions` directly

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
      where: { centerId: parseInt(locationId) },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalLogs = await prisma.petLog.count({
      where: { centerId: parseInt(locationId) },
    });

    return NextResponse.json({ logs, totalLogs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: "Error fetching logs" }, { status: 500 });
  }
}
