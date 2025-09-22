import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/server/jwt"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "changeme")

export async function loginOnServer(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user) throw new Error("Invalid credentials")

  const isPasswordValid = await bcrypt.compare(data.password, user.password)
  if (!isPasswordValid) throw new Error("Invalid credentials")

  const token = await new SignJWT({ id: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  return { id: user.id, email: user.email, name: user.name }
}

export async function getUserOrThrow() {
  const token = (await cookies()).get("token")?.value
  const payload = await verifyJwt(token || "")
  if (!payload || typeof payload !== "object" || !("id" in payload)) {
    throw new Error("Not authenticated")
  }

  const user = await prisma.user.findUnique({ where: { id: String(payload.id) } })
  if (!user) throw new Error("User not found")

  return user
}

export async function registerOnServer(data: { name?: string; email: string; password: string }) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
  if (existingUser) throw new Error("User already exists")

  const password_hash = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
  data: { 
    name: data.name, 
    email: data.email, 
    password: password_hash,
  },
})

  return { id: user.id, name: user.name, email: user.email }
}
