export async function getCurrentUser() {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}
