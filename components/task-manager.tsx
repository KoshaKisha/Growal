"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Calendar, Clock, Tag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  fetchCalendars, 
  fetchTasks,
  createCalendar, 
  createTask,
  updateCalendar,
  updateTask,
  deleteCalendar,
  deleteTask
} from "@/lib/api"

interface TaskCalendar {
  id: string
  name: string
  color: string
}

interface Task {
  id: string
  title: string
  description: string
  date: string
  time?: string
  isAllDay: boolean
  calendarId: string
  completed: boolean
  createdAt: string
}

const COLORS = [
  { name: "Бежевый", value: "#f5f5dc" },
  { name: "Розовый", value: "#e0bbd4" },
  { name: "Голубой", value: "#add8e6" },
  { name: "Коралловый", value: "#ff6f61" },
  { name: "Лавандовый", value: "#e6e6fa" },
  { name: "Мятный", value: "#f0fff0" },
  { name: "Персиковый", value: "#ffdbac" },
  { name: "Сиреневый", value: "#dda0dd" },
]

export function TaskManager() {
  const [calendars, setCalendars] = useState<TaskCalendar[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [cals, tks] = await Promise.all([fetchCalendars(), fetchTasks()])
        setCalendars(cals)
        setTasks(tks)
      } catch (err) {
        console.error("Ошибка загрузки:", err)
      }
    }
    loadData()
  }, [])

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingCalendar, setEditingCalendar] = useState<TaskCalendar | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [showCompleted, setShowCompleted] = useState(true)

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    isAllDay: false,
    calendarId: calendars[0]?.id || "",
  })

  const [calendarForm, setCalendarForm] = useState({
    name: "",
    color: COLORS[0].value,
  })

  const handleCalendarSubmit = async () => {
  if (!calendarForm.name) return

  try {
    if (editingCalendar) {
      // обновление календаря
      const updated = await updateCalendar(editingCalendar.id, {
        name: calendarForm.name,
        color: calendarForm.color,
      })
      setCalendars(calendars.map((c) => (c.id === editingCalendar.id ? updated : c)))
    } else {
      // создание календаря
      const created = await createCalendar({
        name: calendarForm.name,
        color: calendarForm.color,
      })
      setCalendars([...calendars, created])
    }
    resetCalendarForm()
  } catch (err) {
    console.error("Ошибка сохранения календаря:", err)
  }
}

const handleTaskSubmit = async () => {
  if (!taskForm.title || !taskForm.date || !taskForm.calendarId) return

  try {
    if (editingTask) {
      // обновление задачи
      const updated = await updateTask(editingTask.id, {
        title: taskForm.title,
        description: taskForm.description,
        date: taskForm.date,
        time: taskForm.isAllDay ? null : taskForm.time,
        isAllDay: taskForm.isAllDay,
        calendarId: taskForm.calendarId,
      })
      setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)))
    } else {
      // создание новой задачи
      const created = await createTask({
        title: taskForm.title,
        description: taskForm.description,
        date: taskForm.date,
        time: taskForm.isAllDay ? null : taskForm.time,
        isAllDay: taskForm.isAllDay,
        calendarId: taskForm.calendarId,
      })
      setTasks([...tasks, created])
    }
    resetTaskForm()
  } catch (err) {
    console.error("Ошибка сохранения задачи:", err)
  }
}

const handleDeleteTask = async (id: string) => {
  try {
    await deleteTask(id)
    setTasks(tasks.filter((t) => t.id !== id))
  } catch (err) {
    console.error("Ошибка удаления задачи:", err)
  }
}

const handleDeleteCalendar = async (id: string) => {
  const hasTasksInCalendar = tasks.some((t) => t.calendarId === id)
  if (hasTasksInCalendar) {
    alert("Нельзя удалить календарь, в котором есть задачи")
    return
  }

  try {
    await deleteCalendar(id)
    setCalendars(calendars.filter((c) => c.id !== id))
  } catch (err) {
    console.error("Ошибка удаления календаря:", err)
  }
}


  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      date: "",
      time: "",
      isAllDay: false,
      calendarId: calendars[0]?.id || "",
    })
    setEditingTask(null)
    setIsTaskDialogOpen(false)
  }

  const resetCalendarForm = () => {
    setCalendarForm({
      name: "",
      color: COLORS[0].value,
    })
    setEditingCalendar(null)
    setIsCalendarDialogOpen(false)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      description: task.description,
      date: task.date,
      time: task.time || "",
      isAllDay: task.isAllDay,
      calendarId: task.calendarId,
    })
    setIsTaskDialogOpen(true)
  }

  const handleEditCalendar = (calendar: TaskCalendar) => {
    setEditingCalendar(calendar)
    setCalendarForm({
      name: calendar.name,
      color: calendar.color,
    })
    setIsCalendarDialogOpen(true)
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const getCalendarById = (id: string) => {
    return calendars.find((c) => c.id === id)
  }

  const filteredTasks = tasks.filter((task) => {
    if (!showCompleted && task.completed) return false
    if (filter === "all") return true
    return task.calendarId === filter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Управление задачами</h2>
          <p className="text-muted-foreground">Разовые задачи и события с категориями</p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-border bg-transparent">
                <Tag className="w-4 h-4 mr-2" />
                Календари
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">
                  {editingCalendar ? "Редактировать календарь" : "Новый календарь"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Создайте категорию для группировки задач
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="calendarName" className="text-card-foreground">
                    Название
                  </Label>
                  <Input
                    id="calendarName"
                    value={calendarForm.name}
                    onChange={(e) => setCalendarForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Работа, Личное, Учеба..."
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-card-foreground">Цвет</Label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          calendarForm.color === color.value ? "border-ring" : "border-border"
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setCalendarForm((prev) => ({ ...prev, color: color.value }))}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {!editingCalendar && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <h4 className="font-medium text-card-foreground">Существующие календари</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {calendars.map((calendar) => (
                        <div key={calendar.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: calendar.color }} />
                            <span className="text-sm text-foreground">{calendar.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCalendar(calendar)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCalendar(calendar.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetCalendarForm} className="border-border bg-transparent">
                  Отмена
                </Button>
                <Button onClick={handleCalendarSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {editingCalendar ? "Сохранить" : "Создать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Добавить задачу
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">
                  {editingTask ? "Редактировать задачу" : "Новая задача"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Создайте разовую задачу или событие
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTitle" className="text-card-foreground">
                    Название
                  </Label>
                  <Input
                    id="taskTitle"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Подготовить презентацию"
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taskDescription" className="text-card-foreground">
                    Описание
                  </Label>
                  <Textarea
                    id="taskDescription"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Дополнительная информация о задаче"
                    className="bg-input border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskDate" className="text-card-foreground">
                      Дата
                    </Label>
                    <Input
                      id="taskDate"
                      type="date"
                      value={taskForm.date}
                      onChange={(e) => setTaskForm((prev) => ({ ...prev, date: e.target.value }))}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taskCalendar" className="text-card-foreground">
                      Календарь
                    </Label>
                    <Select
                      value={taskForm.calendarId}
                      onValueChange={(value) => setTaskForm((prev) => ({ ...prev, calendarId: value }))}
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {calendars.map((calendar) => (
                          <SelectItem key={calendar.id} value={calendar.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: calendar.color }} />
                              {calendar.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allDay"
                    checked={taskForm.isAllDay}
                    onCheckedChange={(checked) => setTaskForm((prev) => ({ ...prev, isAllDay: checked }))}
                  />
                  <Label htmlFor="allDay" className="text-card-foreground">
                    Весь день
                  </Label>
                </div>

                {!taskForm.isAllDay && (
                  <div className="space-y-2">
                    <Label htmlFor="taskTime" className="text-card-foreground">
                      Время
                    </Label>
                    <Input
                      id="taskTime"
                      type="time"
                      value={taskForm.time}
                      onChange={(e) => setTaskForm((prev) => ({ ...prev, time: e.target.value }))}
                      className="bg-input border-border"
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetTaskForm} className="border-border bg-transparent">
                  Отмена
                </Button>
                <Button onClick={handleTaskSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {editingTask ? "Сохранить" : "Создать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-card-foreground">Фильтр:</Label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40 bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">Все календари</SelectItem>
                    {calendars.map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: calendar.color }} />
                          {calendar.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="showCompleted" checked={showCompleted} onCheckedChange={setShowCompleted} />
              <Label htmlFor="showCompleted" className="text-card-foreground">
                Показать выполненные
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Нет задач для отображения</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const calendar = getCalendarById(task.calendarId)
            return (
              <Card key={task.id} className={`bg-card border-border ${task.completed ? "opacity-60" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1"
                      />

                      <div className="w-1 h-16 rounded-full" style={{ backgroundColor: calendar?.color }} />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold text-card-foreground ${task.completed ? "line-through" : ""}`}>
                            {task.title}
                          </h3>
                          {calendar && (
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: calendar.color + "40",
                                color: "#1f2937",
                              }}
                            >
                              {calendar.name}
                            </Badge>
                          )}
                          {task.completed && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                              <Check className="w-3 h-3 mr-1" />
                              Выполнено
                            </Badge>
                          )}
                        </div>

                        {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(task.date)}
                          </div>

                          {!task.isAllDay && task.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(task.time)}
                            </div>
                          )}

                          {task.isAllDay && (
                            <Badge variant="outline" className="text-xs">
                              Весь день
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
