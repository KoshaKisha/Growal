"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/client/auth/auth-get"
import LandingPageForm from "@/components/LendingPage"
export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkUser() {
      const data = await getCurrentUser()
      if (data?.user) {
        router.replace("/dashboard")
      } else {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) return null 

  return <LandingPageForm /> 
}
