import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/server/auth/auth-client"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const data = await req.json()
    const updatedCalendar = await prisma.taskCalendar.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color,
      },
    })
    return NextResponse.json(updatedCalendar)
  } catch (err) {
    console.error("Ошибка обновления календаря:", err)
    return NextResponse.json({ error: "Не удалось обновить календарь" }, { status: 500 })
  }
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const calendar = await prisma.taskCalendar.findUnique({
    where: { id: params.id },
    include: { tasks: true },
  })

  if (!calendar) return NextResponse.json({ error: "Calendar not found" }, { status: 404 })
  if (calendar.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  if (calendar.tasks.length > 0) {
    return NextResponse.json({ error: "Нельзя удалить календарь, в котором есть задачи" }, { status: 400 })
  }

  await prisma.taskCalendar.delete({ where: { id: params.id } })

  return NextResponse.json({ message: "Calendar deleted" })
}