import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwt } from "@/lib/server/jwt"

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  const isAuthPage = pathname.startsWith("/auth")

  if (token) {
    const payload = await verifyJwt(token)
    if (payload && isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  } else {
    if (!isAuthPage && pathname !== "/") {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}
