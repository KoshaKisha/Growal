export async function saveWeekSettings(settings: {
  weekType: "alternating" | "custom" | "none"
  weekInterval: number
  customWeekNames: string[]
}) {
  const res = await fetch("/api/week-settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  })

  if (!res.ok) throw new Error("Не удалось сохранить настройки")
  return res.json()
}

export async function getWeekSettings() {
  const res = await fetch("/api/week-settings", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) throw new Error("Не удалось загрузить настройки")
  return res.json() as Promise<{
    weekType: "alternating" | "custom" | "none"
    weekInterval: number
    customWeekNames: string[]
  }>
}
