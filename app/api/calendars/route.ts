import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"
import { getCurrentUser } from "@/lib/server/auth/auth-client"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const calendars = await prisma.taskCalendar.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json(calendars)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const calendar = await prisma.taskCalendar.create({
    data: {
      ...data,
      userId: user.id,
    },
  })
  return NextResponse.json(calendar)
}
