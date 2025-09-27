import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/server/auth/auth-client"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()

  const homework = await prisma.homework.findUnique({ where: { id: params.id } })
  if (!homework || homework.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.homework.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(updated)
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.homework.deleteMany({ where: { id: params.id, userId: user.id } })
  return NextResponse.json({ success: true })
}
