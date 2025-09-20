"use client"

import { useState } from "react"
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

// Mock data for schedule events
const MOCK_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: "1",
    title: "Математический анализ",
    description: "Лекция по дифференциальному исчислению",
    location: "Аудитория 205",
    startTime: "09:00",
    endTime: "10:30",
    weekType: "both",
    days: ["monday", "wednesday"],
    color: "#f5f5dc",
  },
  {
    id: "2",
    title: "Программирование",
    description: "Практические занятия по Python",
    location: "Компьютерный класс",
    startTime: "10:45",
    endTime: "12:15",
    weekType: "upper",
    days: ["tuesday", "thursday"],
    color: "#e0bbd4",
  },
  {
    id: "3",
    title: "Физика",
    description: "Лабораторные работы",
    location: "Лаборатория 101",
    startTime: "13:00",
    endTime: "14:30",
    weekType: "lower",
    days: ["friday"],
    color: "#add8e6",
  },
]

export function HomeworkManager() {
  const [scheduleEvents] = useState<ScheduleEvent[]>(MOCK_SCHEDULE_EVENTS)
  const [homeworkAssignments, setHomeworkAssignments] = useState<HomeworkAssignment[]>([
    {
      id: "1",
      scheduleEventId: "1",
      title: "Решить задачи по интегралам",
      description: "Задачи 15-20 из учебника Демидовича",
      notes: "Контрольная работа на следующей паре",
      dueDate: "2025-09-22",
      dueTime: "09:00",
      isAllDay: false,
      completed: false,
      createdAt: "2025-09-18T10:00:00Z",
      linkedTaskId: "hw-task-1",
    },
    {
      id: "2",
      scheduleEventId: "2",
      title: "Написать программу сортировки",
      description: "Реализовать алгоритм быстрой сортировки на Python",
      notes: "Сдача через GitHub",
      dueDate: "2025-09-25",
      isAllDay: true,
      completed: true,
      createdAt: "2025-09-17T14:00:00Z",
    },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "hw-task-1",
      title: "Решить задачи по интегралам",
      description: "Задачи 15-20 из учебника Демидовича",
      date: "2025-09-22",
      time: "09:00",
      isAllDay: false,
      calendarId: "3", // Учеба
      completed: false,
      createdAt: "2025-09-18T10:00:00Z",
      homeworkId: "1",
    },
  ])

  const [isHomeworkDialogOpen, setIsHomeworkDialogOpen] = useState(false)
  const [isTaskCreationDialogOpen, setIsTaskCreationDialogOpen] = useState(false)
  const [editingHomework, setEditingHomework] = useState<HomeworkAssignment | null>(null)
  const [selectedHomeworkForTask, setSelectedHomeworkForTask] = useState<HomeworkAssignment | null>(null)

  const [homeworkForm, setHomeworkForm] = useState({
    scheduleEventId: "",
    title: "",
    description: "",
    notes: "",
    dueDate: "",
    dueTime: "",
    isAllDay: false,
  })

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    isAllDay: false,
  })

  const handleHomeworkSubmit = () => {
    if (!homeworkForm.scheduleEventId || !homeworkForm.title || !homeworkForm.dueDate) {
      return
    }

    const newHomework: HomeworkAssignment = {
      id: editingHomework?.id || Date.now().toString(),
      scheduleEventId: homeworkForm.scheduleEventId,
      title: homeworkForm.title,
      description: homeworkForm.description,
      notes: homeworkForm.notes,
      dueDate: homeworkForm.dueDate,
      dueTime: homeworkForm.isAllDay ? undefined : homeworkForm.dueTime,
      isAllDay: homeworkForm.isAllDay,
      completed: editingHomework?.completed || false,
      createdAt: editingHomework?.createdAt || new Date().toISOString(),
      linkedTaskId: editingHomework?.linkedTaskId,
    }

    if (editingHomework) {
      setHomeworkAssignments(homeworkAssignments.map((h) => (h.id === editingHomework.id ? newHomework : h)))
    } else {
      setHomeworkAssignments([...homeworkAssignments, newHomework])
      // Auto-suggest task creation
      setSelectedHomeworkForTask(newHomework)
      setTaskForm({
        title: newHomework.title,
        description: newHomework.description,
        date: newHomework.dueDate,
        time: newHomework.dueTime || "",
        isAllDay: newHomework.isAllDay,
      })
      setIsTaskCreationDialogOpen(true)
    }

    resetHomeworkForm()
  }

  const handleTaskCreation = () => {
    if (!selectedHomeworkForTask || !taskForm.title || !taskForm.date) {
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      date: taskForm.date,
      time: taskForm.isAllDay ? undefined : taskForm.time,
      isAllDay: taskForm.isAllDay,
      calendarId: "3", // Default to "Учеба" calendar
      completed: false,
      createdAt: new Date().toISOString(),
      homeworkId: selectedHomeworkForTask.id,
    }

    setTasks([...tasks, newTask])

    // Update homework with linked task
    setHomeworkAssignments(
      homeworkAssignments.map((h) => (h.id === selectedHomeworkForTask.id ? { ...h, linkedTaskId: newTask.id } : h)),
    )

    resetTaskForm()
  }

  const resetHomeworkForm = () => {
    setHomeworkForm({
      scheduleEventId: "",
      title: "",
      description: "",
      notes: "",
      dueDate: "",
      dueTime: "",
      isAllDay: false,
    })
    setEditingHomework(null)
    setIsHomeworkDialogOpen(false)
  }

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      date: "",
      time: "",
      isAllDay: false,
    })
    setSelectedHomeworkForTask(null)
    setIsTaskCreationDialogOpen(false)
  }

  const handleEditHomework = (homework: HomeworkAssignment) => {
    setEditingHomework(homework)
    setHomeworkForm({
      scheduleEventId: homework.scheduleEventId,
      title: homework.title,
      description: homework.description,
      notes: homework.notes,
      dueDate: homework.dueDate,
      dueTime: homework.dueTime || "",
      isAllDay: homework.isAllDay,
    })
    setIsHomeworkDialogOpen(true)
  }

  const handleDeleteHomework = (id: string) => {
    const homework = homeworkAssignments.find((h) => h.id === id)
    if (homework?.linkedTaskId) {
      // Also delete linked task
      setTasks(tasks.filter((t) => t.id !== homework.linkedTaskId))
    }
    setHomeworkAssignments(homeworkAssignments.filter((h) => h.id !== id))
  }

  const toggleHomeworkCompletion = (id: string) => {
    setHomeworkAssignments(homeworkAssignments.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)))

    // Also toggle linked task if exists
    const homework = homeworkAssignments.find((h) => h.id === id)
    if (homework?.linkedTaskId) {
      setTasks(tasks.map((t) => (t.id === homework.linkedTaskId ? { ...t, completed: !t.completed } : t)))
    }
  }

  const getScheduleEventById = (id: string) => {
    return scheduleEvents.find((e) => e.id === id)
  }

  const getLinkedTask = (homeworkId: string) => {
    return tasks.find((t) => t.homeworkId === homeworkId)
  }

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

  const getNextOccurrence = (scheduleEvent: ScheduleEvent) => {
    // Mock calculation - in real app, this would calculate based on current week type and schedule
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    return nextWeek.toISOString().split("T")[0]
  }

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
                        onClick={() => handleDeleteHomework(homework.id)}
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
