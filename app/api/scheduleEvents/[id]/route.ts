import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/server/auth/auth-client"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const event = await prisma.scheduleEvent.findUnique({ where: { id: params.id } })
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    if (event.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const data = await req.json()
    const updated = await prisma.scheduleEvent.update({
      where: { id: params.id },
      data,
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error("Ошибка при обновлении события:", err)
    return NextResponse.json({ error: "Не удалось обновить событие" }, { status: 500 })
  }
}

// Удаление события текущего пользователя
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const event = await prisma.scheduleEvent.findUnique({ where: { id: params.id } })
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    if (event.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    await prisma.scheduleEvent.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Ошибка при удалении события:", err)
    return NextResponse.json({ error: "Не удалось удалить событие" }, { status: 500 })
  }
}
