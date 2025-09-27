import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/server/auth/auth-client"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        weekSettings: true,
      },
    })

    return NextResponse.json(fullUser?.weekSettings || {
      weekType: "none",
      weekInterval: 1,
      customWeekNames: [],
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Не удалось загрузить настройки" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = await req.json()
    // weekType, weekInterval, customWeekNames
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { weekSettings: data },
    })
    return NextResponse.json(updatedUser.weekSettings)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Не удалось сохранить настройки" }, { status: 500 })
  }
}