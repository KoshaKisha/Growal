// server-only
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { verifyJwt } from "@/lib/server/jwt"

export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value
  if (!token) return null

  const payload = await verifyJwt(token)
  if (!payload || typeof payload !== "object" || !("id" in payload)) return null

  const user = await prisma.user.findUnique({
    where: { id: String(payload.id) },
    select: { id: true, email: true, name: true },
  })
  return user
}
