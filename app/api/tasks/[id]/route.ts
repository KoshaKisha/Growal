import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/server/auth/auth-client"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const data = await req.json()
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time || null,
        isAllDay: data.isAllDay,
        calendarId: data.calendarId,
        completed: data.completed ?? false,
      },
    })
    return NextResponse.json(updatedTask)
  } catch (err) {
    console.error("Ошибка обновления задачи:", err)
    return NextResponse.json({ error: "Не удалось обновить задачу" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const task = await prisma.task.findUnique({
    where: { id: params.id },
  })

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })
  if (task.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  await prisma.task.delete({ where: { id: params.id } })

  return NextResponse.json({ message: "Task deleted" })
}

