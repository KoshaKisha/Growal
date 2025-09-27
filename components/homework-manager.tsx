"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, BookOpen, Calendar, Clock, ArrowRight, CheckSquare } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  getHomeworks,
  createHomework,
  updateHomework,
  deleteHomework,
  HomeworkForm,
} from "@/lib/api/homework"
import {
  fetchTasks,
  updateTask,
  createTask,
  deleteTask,
  TaskForm
} from "@/lib/api"
import { fetchScheduleEvents } from "@/lib/api/schedule"

interface ScheduleEvent {
  id: string
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  weekType: "both" | "upper" | "lower" | "custom"
  days: string[]
  color: string
}

interface HomeworkAssignment {
  id: string
  scheduleEventId: string
  title: string
  description: string
  notes: string
  dueDate: string
  dueTime?: string
  isAllDay: boolean
  completed: boolean
  createdAt: string
  linkedTaskId?: string
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
  homeworkId?: string
}

export function HomeworkManager() {
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([])
  const [homeworkAssignments, setHomeworkAssignments] = useState<HomeworkAssignment[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const [isHomeworkDialogOpen, setIsHomeworkDialogOpen] = useState(false)
  const [isTaskCreationDialogOpen, setIsTaskCreationDialogOpen] = useState(false)
  const [editingHomework, setEditingHomework] = useState<HomeworkAssignment | null>(null)
  const [selectedHomeworkForTask, setSelectedHomeworkForTask] = useState<HomeworkAssignment | null>(null)

  const [homeworkForm, setHomeworkForm] = useState<HomeworkForm>({
    scheduleEventId: "",
    title: "",
    description: "",
    notes: "",
    dueDate: "",
    dueTime: "",
    isAllDay: false,
  })

  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: "",
    description: "",
    date: "",
    time: "",
    isAllDay: false,
  })

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const hw = await getHomeworks()
        const ts = await fetchTasks()
        const se = await fetchScheduleEvents()
        setHomeworkAssignments(hw)
        setTasks(ts)
        setScheduleEvents(se)
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleHomeworkSubmit = async () => {
  if (!homeworkForm.scheduleEventId || !homeworkForm.title || !homeworkForm.dueDate) return

  // Преобразуем дату в ISO перед отправкой
  const isoDueDate = homeworkForm.isAllDay
    ? new Date(homeworkForm.dueDate).toISOString()
    : new Date(`${homeworkForm.dueDate}T${homeworkForm.dueTime || "00:00"}`).toISOString()

  const payload = {
    ...homeworkForm,
    dueDate: isoDueDate,
  }

  try {
    if (editingHomework) {
      const updated = await updateHomework(editingHomework.id, payload)
      setHomeworkAssignments((prev) => prev.map((h) => (h.id === editingHomework.id ? updated : h)))
    } else {
      const created = await createHomework(payload)
      setHomeworkAssignments((prev) => [...prev, created])
      setSelectedHomeworkForTask(created)
      setTaskForm({
        title: created.title,
        description: created.description,
        date: created.dueDate,
        time: created.dueTime || "",
        isAllDay: created.isAllDay,
      })
      setIsTaskCreationDialogOpen(true)
    }
  } catch (err) {
    console.error("Ошибка при сохранении ДЗ:", err)
  } finally {
    resetHomeworkForm()
  }
}

  const handleTaskCreation = async () => {
    if (!selectedHomeworkForTask || !taskForm.title || !taskForm.date) return

    try {
      const newTask = await createTask({ ...taskForm, homeworkId: selectedHomeworkForTask.id })
      setTasks((prev) => [...prev, newTask])
      // обновим ссылку в ДЗ
      setHomeworkAssignments((prev) =>
        prev.map((h) => (h.id === selectedHomeworkForTask.id ? { ...h, linkedTaskId: newTask.id } : h)),
      )
    } catch (err) {
      console.error("Ошибка при создании задачи:", err)
    } finally {
      resetTaskForm()
    }
  }
  const handleEditHomework = (homework: HomeworkAssignment) => {
  setEditingHomework(homework)

  const isoDueDate = homework.isAllDay
    ? new Date(homework.dueDate).toISOString()
    : new Date(`${homework.dueDate}T${homework.dueTime || "00:00"}`).toISOString()

  setHomeworkForm({
    scheduleEventId: homework.scheduleEventId,
    title: homework.title,
    description: homework.description,
    notes: homework.notes,
    dueDate: isoDueDate,
    dueTime: homework.dueTime || "",
    isAllDay: homework.isAllDay,
  })

  setIsHomeworkDialogOpen(true)
}

  const handleDeleteHomeworkClick = async (id: string) => {
    const hw = homeworkAssignments.find((h) => h.id === id)
    try {
      await deleteHomework(id)
      setHomeworkAssignments((prev) => prev.filter((h) => h.id !== id))
      if (hw?.linkedTaskId) {
        await deleteTask(hw.linkedTaskId)
        setTasks((prev) => prev.filter((t) => t.id !== hw.linkedTaskId))
      }
    } catch (err) {
      console.error("Ошибка при удалении ДЗ:", err)
    }
  }

  const toggleHomeworkCompletion = async (id: string) => {
    const hw = homeworkAssignments.find((h) => h.id === id)
    if (!hw) return
    try {
      const updated = await updateHomework(id, { completed: !hw.completed })
      setHomeworkAssignments((prev) => prev.map((h) => (h.id === id ? updated : h)))
      if (hw.linkedTaskId) {
        const updatedTask = await updateTask(hw.linkedTaskId, { completed: !hw.completed })
        setTasks((prev) => prev.map((t) => (t.id === hw.linkedTaskId ? updatedTask : t)))
      }
    } catch (err) {
      console.error("Ошибка при переключении статуса:", err)
    }
  }

  const getNextOccurrence = (scheduleEvent: ScheduleEvent) => {
  // Пока оставим простой мок
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  return nextWeek.toISOString().split("T")[0]
}


  const resetHomeworkForm = () => {
    setHomeworkForm({ scheduleEventId: "", title: "", description: "", notes: "", dueDate: "", dueTime: "", isAllDay: false })
    setEditingHomework(null)
    setIsHomeworkDialogOpen(false)
  }

  const resetTaskForm = () => {
    setTaskForm({ title: "", description: "", date: "", time: "", isAllDay: false })
    setSelectedHomeworkForTask(null)
    setIsTaskCreationDialogOpen(false)
  }

  const getScheduleEventById = (id: string) => scheduleEvents.find((e) => e.id === id)
  const getLinkedTask = (homeworkId: string) => tasks.find((t) => t.homeworkId === homeworkId)
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
  const formatTime = (timeString: string) => timeString?.slice(0, 5)

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Домашние задания</h2>
          <p className="text-muted-foreground">Задания, привязанные к расписанию</p>
        </div>

        <Dialog open={isHomeworkDialogOpen} onOpenChange={setIsHomeworkDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Добавить ДЗ
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">
                {editingHomework ? "Редактировать домашнее задание" : "Новое домашнее задание"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Создайте задание, привязанное к предмету из расписания
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Предмет</Label>
                <Select
                  value={homeworkForm.scheduleEventId}
                  onValueChange={(value) => {
                    setHomeworkForm((prev) => ({ ...prev, scheduleEventId: value }))
                    // Auto-suggest due date as next occurrence
                    const event = getScheduleEventById(value)
                    if (event && !editingHomework) {
                      const nextDate = getNextOccurrence(event)
                      setHomeworkForm((prev) => ({
                        ...prev,
                        dueDate: nextDate,
                        dueTime: event.startTime,
                      }))
                    }
                  }}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Выберите предмет" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {scheduleEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                          {event.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeworkTitle" className="text-card-foreground">
                  Название задания
                </Label>
                <Input
                  id="homeworkTitle"
                  value={homeworkForm.title}
                  onChange={(e) => setHomeworkForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Решить задачи по интегралам"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeworkDescription" className="text-card-foreground">
                  Описание
                </Label>
                <Textarea
                  id="homeworkDescription"
                  value={homeworkForm.description}
                  onChange={(e) => setHomeworkForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Подробное описание задания"
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeworkNotes" className="text-card-foreground">
                  Заметки
                </Label>
                <Textarea
                  id="homeworkNotes"
                  value={homeworkForm.notes}
                  onChange={(e) => setHomeworkForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Дополнительные заметки (контрольная, экзамен и т.д.)"
                  className="bg-input border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeworkDueDate" className="text-card-foreground">
                    Срок сдачи
                  </Label>
                  <Input
                    id="homeworkDueDate"
                    type="date"
                    value={homeworkForm.dueDate}
                    onChange={(e) => setHomeworkForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Switch
                      id="homeworkAllDay"
                      checked={homeworkForm.isAllDay}
                      onCheckedChange={(checked) => setHomeworkForm((prev) => ({ ...prev, isAllDay: checked }))}
                    />
                    <Label htmlFor="homeworkAllDay" className="text-card-foreground">
                      Весь день
                    </Label>
                  </div>

                  {!homeworkForm.isAllDay && (
                    <>
                      <Label htmlFor="homeworkDueTime" className="text-card-foreground">
                        Время
                      </Label>
                      <Input
                        id="homeworkDueTime"
                        type="time"
                        value={homeworkForm.dueTime}
                        onChange={(e) => setHomeworkForm((prev) => ({ ...prev, dueTime: e.target.value }))}
                        className="bg-input border-border"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetHomeworkForm} className="border-border bg-transparent">
                Отмена
              </Button>
              <Button onClick={handleHomeworkSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {editingHomework ? "Сохранить" : "Создать"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Creation Dialog */}
      <Dialog open={isTaskCreationDialogOpen} onOpenChange={setIsTaskCreationDialogOpen}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Создать задачу</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Создать задачу в календаре для этого домашнего задания?
            </DialogDescription>
          </DialogHeader>

          <Alert className="bg-secondary/20 border-secondary">
            <CheckSquare className="h-4 w-4" />
            <AlertDescription className="text-card-foreground">
              Система автоматически предлагает создать задачу на дату следующего занятия. Вы можете изменить дату и
              время.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="taskTitle" className="text-card-foreground">
                Название задачи
              </Label>
              <Input
                id="taskTitle"
                value={taskForm.title}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
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
                className="bg-input border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskDate" className="text-card-foreground">
                  Дата выполнения
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
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="taskAllDay"
                    checked={taskForm.isAllDay}
                    onCheckedChange={(checked) => setTaskForm((prev) => ({ ...prev, isAllDay: checked }))}
                  />
                  <Label htmlFor="taskAllDay" className="text-card-foreground text-sm">
                    Весь день
                  </Label>
                </div>

                {!taskForm.isAllDay && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetTaskForm} className="border-border bg-transparent">
              Пропустить
            </Button>
            <Button onClick={handleTaskCreation} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Создать задачу
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Homework List */}
      <div className="grid gap-4">
        {homeworkAssignments.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Нет домашних заданий</p>
            </CardContent>
          </Card>
        ) : (
          homeworkAssignments.map((homework) => {
            const scheduleEvent = getScheduleEventById(homework.scheduleEventId)
            const linkedTask = getLinkedTask(homework.id)
            return (
              <Card key={homework.id} className={`bg-card border-border ${homework.completed ? "opacity-60" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={homework.completed}
                        onChange={() => toggleHomeworkCompletion(homework.id)}
                        className="mt-1 rounded"
                      />

                      <div className="w-1 h-20 rounded-full" style={{ backgroundColor: scheduleEvent?.color }} />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3
                            className={`font-semibold text-card-foreground ${homework.completed ? "line-through" : ""}`}
                          >
                            {homework.title}
                          </h3>
                          {scheduleEvent && (
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{
                                backgroundColor: scheduleEvent.color + "40",
                                color: "#1f2937",
                              }}
                            >
                              {scheduleEvent.title}
                            </Badge>
                          )}
                          {homework.completed && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                              Выполнено
                            </Badge>
                          )}
                        </div>

                        {homework.description && (
                          <p className="text-sm text-muted-foreground mb-2">{homework.description}</p>
                        )}

                        {homework.notes && (
                          <div className="bg-muted p-2 rounded-lg mb-2">
                            <p className="text-sm text-foreground">{homework.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Срок: {formatDate(homework.dueDate)}
                          </div>

                          {!homework.isAllDay && homework.dueTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(homework.dueTime)}
                            </div>
                          )}

                          {homework.isAllDay && (
                            <Badge variant="outline" className="text-xs">
                              Весь день
                            </Badge>
                          )}
                        </div>

                        {linkedTask && (
                          <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-lg">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">Связанная задача: {linkedTask.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {linkedTask.completed ? "Выполнена" : "В работе"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditHomework(homework)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteHomeworkClick(homework.id)}
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
