import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const events = await prisma.scheduleEvent.findMany({
      orderBy: { startTime: "asc" },
    })
    return NextResponse.json(events)
  } catch (err) {
    console.error("Ошибка при получении расписания:", err)
    return NextResponse.json({ error: "Ошибка при получении расписания" }, { status: 500 })
  }
}
