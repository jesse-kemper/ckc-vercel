import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  
  try {
    const log = await prisma.petLog.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })
    return NextResponse.json(log)
  } catch (error) {
    return NextResponse.json({ error: "Error creating log" }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const logs = await prisma.petLog.findMany({
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(logs)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching logs" }, { status: 500 })
  }
}
