export interface HomeworkForm {
  scheduleEventId: string
  title: string
  description?: string
  notes?: string
  dueDate: string
  dueTime?: string
  isAllDay: boolean
}

export async function getHomeworks() {
  const res = await fetch("/api/homework")
  if (!res.ok) throw new Error("Не удалось загрузить домашние задания")
  return res.json()
}

export async function createHomework(data: HomeworkForm) {
  const res = await fetch("/api/homework", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Не удалось создать домашнее задание")
  return res.json()
}

export async function updateHomework(id: string, data: Partial<HomeworkForm & { completed?: boolean }>) {
  const res = await fetch(`/api/homework/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Не удалось обновить домашнее задание")
  return res.json()
}

export async function deleteHomework(id: string) {
  const res = await fetch(`/api/homework/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Не удалось удалить домашнее задание")
  return res.json()
}

