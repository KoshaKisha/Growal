"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/lib/hooks/useCurrentUser"
import LoginForm from "@/components/LoginForm"

export default function LoginPageWrapper() {
  const router = useRouter()
  const { user, loading } = useCurrentUser()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  if (loading || user) return null

  return <LoginForm />
}
