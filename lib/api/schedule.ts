const BASE_URL = "/api/scheduleEvents"

export async function fetchScheduleEvents(userId?: string) {
  const url = userId ? `${BASE_URL}?userId=${userId}` : BASE_URL
  const res = await fetch(url)
  return res.json()
}

export async function createScheduleEvent(data: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateScheduleEvent(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteScheduleEvent(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })
  return res.json()
}
