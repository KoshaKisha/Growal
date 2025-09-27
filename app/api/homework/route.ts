import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const homeworks = await prisma.homework.findMany({
      orderBy: { dueDate: "asc" },
    })
    return NextResponse.json(homeworks)
  } catch (err) {
    console.error("Ошибка при получении домашних заданий:", err)
    return NextResponse.json({ error: "Ошибка при получении домашних заданий" }, { status: 500 })
  }
}
