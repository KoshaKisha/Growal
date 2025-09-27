import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/server/auth/auth-client"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const events = await prisma.scheduleEvent.findMany({
      where: { userId: user.id },
      orderBy: { startTime: "asc" },
    })
    return NextResponse.json(events)
  } catch (err) {
    console.error("Ошибка при получении расписания:", err)
    return NextResponse.json({ error: "Ошибка при получении расписания" }, { status: 500 })
  }
}

// Создание нового события для текущего пользователя
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = await req.json()
    const event = await prisma.scheduleEvent.create({
      data: {
        ...data,
        userId: user.id,
      },
    })
    return NextResponse.json(event)
  } catch (err) {
    console.error("Ошибка при создании события:", err)
    return NextResponse.json({ error: "Не удалось создать событие" }, { status: 500 })
  }
}