import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"
import { getCurrentUser } from "@/lib/server/auth/auth-client"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    include: { calendar: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const task = await prisma.task.create({
    data: {
      ...data,
      userId: user.id,
      date: new Date(data.date),
      time: data.time || null,
    },
  })
  return NextResponse.json(task)
}
