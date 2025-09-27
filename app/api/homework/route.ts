import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/server/auth/auth-client"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const homeworks = await prisma.homework.findMany({
    where: { userId: user.id },
    orderBy: { dueDate: "asc" },
  })
  return NextResponse.json(homeworks)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const homework = await prisma.homework.create({
    data: {
      ...data,
      userId: user.id,
    },
  })
  return NextResponse.json(homework)
}
