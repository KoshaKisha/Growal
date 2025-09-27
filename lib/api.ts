export async function updateTask(id: string, data: any) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  if (!res.ok) throw new Error("Ошибка обновления задачи")
  return res.json()
}

export async function fetchTasks() {
  const res = await fetch("/api/tasks", { cache: "no-store", credentials: "include", })
  if (!res.ok) throw new Error("Ошибка загрузки задач")
  return res.json()
}

export async function createTask(task: any) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
    credentials: "include",
  })
  if (!res.ok) throw new Error("Ошибка создания задачи")
  return res.json()
}

export async function updateCalendar(id: string, data: { name: string; color: string }) {
  const res = await fetch(`/api/calendars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  if (!res.ok) throw new Error("Ошибка обновления календаря")
  return res.json()
}

export async function fetchCalendars() {
  const res = await fetch("/api/calendars", { cache: "no-store", credentials: "include", })
  if (!res.ok) throw new Error("Ошибка загрузки календарей")
  return res.json()
}

export async function createCalendar(calendar: any) {
  const res = await fetch("/api/calendars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(calendar),
    credentials: "include",
  })
  if (!res.ok) throw new Error("Ошибка создания календаря")
  return res.json()
}

export async function deleteTask(id: string) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) throw new Error("Ошибка удаления задачи")
  return res.json()
}

export async function deleteCalendar(id: string) {
  const res = await fetch(`/api/calendars/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) throw new Error("Ошибка удаления календаря")
  return res.json()
}

export async function fetchScheduleEvents() {
  const res = await fetch("/api/scheduleEvents", { cache: "no-store", credentials: "include" })
  if (!res.ok) throw new Error("Ошибка загрузки расписания")
  return res.json()
}

export async function fetchHomework() {
  const res = await fetch("/api/homework", { cache: "no-store", credentials: "include" })
  if (!res.ok) throw new Error("Ошибка загрузки домашних заданий")
  return res.json()
}
