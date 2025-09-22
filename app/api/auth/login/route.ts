import { NextResponse } from "next/server"
import { loginOnServer } from "@/lib/server/auth/auth-server"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const user = await loginOnServer(data)
    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
