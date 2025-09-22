export async function getCurrentUser() {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.error("Ошибка получения текущего пользователя:", err)
    return null
  }
}