"use client"

import { useState, useEffect } from "react"
import { fetchCalendars, fetchTasks, fetchScheduleEvents, fetchHomework } from "@/lib/api"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, BookOpen, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface TaskCalendar {
  id: string
  name: string
  color: string
}

const DAYS_OF_WEEK = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
const DAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
]

interface CalendarViewsProps {
  currentWeek: "upper" | "lower"
}

export function CalendarViews({ currentWeek }: CalendarViewsProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("day")
  const [calendars, setCalendars] = useState<TaskCalendar[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([])
  const [homework, setHomework] = useState<HomeworkAssignment[]>([])
  const [visibleCalendars, setVisibleCalendars] = useState<string[]>([])

  useEffect(() => {
  async function loadData() {
    try {
      const cals: TaskCalendar[] = await fetchCalendars()
      const tks: Task[] = await fetchTasks()
      const events: ScheduleEvent[] = await fetchScheduleEvents()
      const hw: HomeworkAssignment[] = await fetchHomework()

      setCalendars(cals)
      setVisibleCalendars(cals.map((c) => c.id))
      setTasks(tks)
      setScheduleEvents(events)
      setHomework(hw)
    } catch (err) {
      console.error("Ошибка загрузки данных:", err)
    }
  }

  loadData()
}, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  const getEventsForDate = (date: Date) => {
  const dayOfWeek = date.getDay() // 0 = воскресенье
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const dayName = dayNames[dayOfWeek]

  // Фильтруем расписание по дню недели и типу недели
  const scheduleEventsForDay = scheduleEvents.filter((event) => {
    if (!event.days.includes(dayName)) return false
    if (event.weekType === "both") return true
    if (event.weekType === currentWeek) return true
    return false
  })

  // Фильтруем задачи по дате и видимым календарям
  const tasksForDay = tasks.filter((task) => {
    const taskDate = new Date(task.date)
    return (
      taskDate.getFullYear() === date.getFullYear() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getDate() === date.getDate() &&
      visibleCalendars.includes(task.calendarId)
    )
  })

  // Фильтруем домашку по dueDate
  const homeworkForDay = homework.filter((hw) => {
    const hwDate = new Date(hw.dueDate)
    return (
      hwDate.getFullYear() === date.getFullYear() &&
      hwDate.getMonth() === date.getMonth() &&
      hwDate.getDate() === date.getDate()
    )
  })

  return { scheduleEvents: scheduleEventsForDay, tasks: tasksForDay, homework: homeworkForDay }
}


  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else if (view === "month") {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const getCalendarById = (id: string) => {
    return calendars.find((c) => c.id === id)
  }

  const getScheduleEventById = (id: string) => {
    return scheduleEvents.find((e) => e.id === id)
  }

  const renderDayView = () => {
    const { scheduleEvents: dayScheduleEvents, tasks: dayTasks, homework: dayHomework } = getEventsForDate(currentDate)

    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">{formatDate(currentDate)}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {currentWeek === "upper" ? "Верхняя неделя" : "Нижняя неделя"}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Schedule Events */}
            {dayScheduleEvents.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Расписание
                </h3>
                {dayScheduleEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border"
                    style={{ backgroundColor: event.color + "20" }}
                  >
                    <div className="text-sm font-medium text-foreground">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{event.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tasks */}
            {dayTasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Задачи
                </h3>
                {dayTasks.map((task) => {
                  const calendar = getCalendarById(task.calendarId)
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border border-border ${
                        task.completed ? "opacity-60" : ""
                      }`}
                      style={{ backgroundColor: calendar?.color + "20" }}
                    >
                      <input type="checkbox" checked={task.completed} readOnly className="rounded" />
                      <div className="flex-1">
                        <div className={`font-medium text-foreground ${task.completed ? "line-through" : ""}`}>
                          {task.title}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          {!task.isAllDay && task.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(task.time)}
                            </span>
                          )}
                          {calendar && <Badge variant="outline">{calendar.name}</Badge>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Homework */}
            {dayHomework.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Домашние задания
                </h3>
                {dayHomework.map((hw) => {
                  const scheduleEvent = getScheduleEventById(hw.scheduleEventId)
                  return (
                    <div
                      key={hw.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border border-border ${
                        hw.completed ? "opacity-60" : ""
                      }`}
                      style={{ backgroundColor: scheduleEvent?.color + "20" }}
                    >
                      <input type="checkbox" checked={hw.completed} readOnly className="rounded" />
                      <div className="flex-1">
                        <div className={`font-medium text-foreground ${hw.completed ? "line-through" : ""}`}>
                          {hw.title}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          {!hw.isAllDay && hw.dueTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(hw.dueTime)}
                            </span>
                          )}
                          {scheduleEvent && <Badge variant="outline">{scheduleEvent.title}</Badge>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {dayScheduleEvents.length === 0 && dayTasks.length === 0 && dayHomework.length === 0 && (
              <div className="text-center text-muted-foreground py-8">Нет событий на этот день</div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

const renderWeekView = () => {
  const startOfWeek = new Date(currentDate)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">
          Неделя {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {currentWeek === "upper" ? "Верхняя неделя" : "Нижняя неделя"}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, index) => {
            const {
              scheduleEvents: dayScheduleEvents,
              tasks: dayTasks,
              homework: dayHomework,
            } = getEventsForDate(date)
            const isToday = date.toDateString() === new Date().toDateString()

            return (
              <div key={index} className="space-y-2">
                <div
                  className={`text-center p-2 rounded-lg ${
                    isToday ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <div className="text-sm font-medium">{DAYS_SHORT[index]}</div>
                  <div className="text-lg">{date.getDate()}</div>
                </div>

                <div className="space-y-1">
                  {/* Расписание */}
                  {dayScheduleEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded text-foreground overflow-hidden"
                      style={{ backgroundColor: event.color }}
                    >
                      <div className="text-[10px]">{formatTime(event.startTime)}</div>
                      <div className="truncate" title={event.title}>
                        {event.title}
                      </div>
                    </div>
                  ))}

                  {/* Задачи */}
                  {dayTasks.map((task) => {
                    const calendar = getCalendarById(task.calendarId)
                    return (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded border flex flex-col gap-1 ${
                          task.completed ? "opacity-60 line-through" : ""
                        }`}
                        style={{
                          backgroundColor: calendar?.color + "40",
                          borderColor: calendar?.color,
                        }}
                      >
                       <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            readOnly
                            className="rounded flex-shrink-0"
                          />
                          <span className="text-[10px] truncate" title="Задача">
                            Задача
                          </span>
                        </div>
                        <div className="truncate" title={task.title}>
                          {task.title}
                        </div>
                      </div>
                    )
                  })}

                  {/* Домашка */}
                  {dayHomework.map((hw) => {
                    const scheduleEvent = getScheduleEventById(hw.scheduleEventId)
                    return (
                      <div
                        key={hw.id}
                        className={`text-xs p-1 rounded border-l-2 bg-muted flex flex-col gap-1 ${
                          hw.completed ? "opacity-60" : ""
                        }`}
                        style={{ borderLeftColor: scheduleEvent?.color }}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={hw.completed}
                            readOnly
                            className="rounded flex-shrink-0"
                          />
                          <span className="text-[10px]">ДЗ</span>
                        </div>
                        <div className="truncate" title={hw.title}>
                          {hw.title}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}



  const renderMonthView = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    const endDate = new Date(lastDay)

    // Adjust to show full weeks
    startDate.setDate(firstDay.getDate() - firstDay.getDay() + 1)
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()) + 1)

    const days = []
    const currentDateIter = new Date(startDate)

    while (currentDateIter <= endDate) {
      days.push(new Date(currentDateIter))
      currentDateIter.setDate(currentDateIter.getDate() + 1)
    }

    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            {MONTHS[month]} {year}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {currentWeek === "upper" ? "Верхняя неделя" : "Нижняя неделя"}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAYS_SHORT.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const {
                scheduleEvents: dayScheduleEvents,
                tasks: dayTasks,
                homework: dayHomework,
              } = getEventsForDate(date)
              const isCurrentMonth = date.getMonth() === month
              const isToday = date.toDateString() === new Date().toDateString()
              const hasEvents = dayScheduleEvents.length > 0 || dayTasks.length > 0 || dayHomework.length > 0

              return (
                <div
                  key={index}
                  className={`min-h-20 p-1 border border-border rounded-lg ${
                    isCurrentMonth ? "bg-background" : "bg-muted/50"
                  } ${isToday ? "ring-2 ring-accent" : ""}`}
                >
                  <div className={`text-sm ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}>
                    {date.getDate()}
                  </div>

                  {hasEvents && (
                    <div className="space-y-1 mt-1">
                      {/* Schedule events */}
                      {dayScheduleEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-[10px] p-1 rounded text-foreground truncate"
                          style={{ backgroundColor: event.color + "40" }}
                          title={`${event.title} (${formatTime(event.startTime)})`}
                        >
                          <div className="font-medium">{formatTime(event.startTime)}</div>
                          <div className="truncate">{event.title}</div>
                        </div>
                      ))}

                      {/* Tasks */}
                      {dayTasks.slice(0, 2).map((task) => {
                        const calendar = getCalendarById(task.calendarId)
                        return (
                          <div
                            key={task.id}
                            className={`text-[10px] p-1 rounded border truncate ${
                              task.completed ? "opacity-50 line-through" : ""
                            }`}
                            style={{ backgroundColor: calendar?.color + "30", borderColor: calendar?.color }}
                            title={task.title}
                          >
                            <div className="truncate">{task.title}</div>
                          </div>
                        )
                      })}

                      {/* Homework */}
                      {dayHomework.slice(0, 1).map((hw) => {
                        const scheduleEvent = getScheduleEventById(hw.scheduleEventId)
                        return (
                          <div
                            key={hw.id}
                            className="text-[10px] p-1 rounded border-l-2 bg-muted truncate"
                            style={{ borderLeftColor: scheduleEvent?.color }}
                            title={`ДЗ: ${hw.title}`}
                          >
                            ДЗ: {hw.title}
                          </div>
                        )
                      })}

                      {/* More counter */}
                      {dayScheduleEvents.length + dayTasks.length + dayHomework.length > 5 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{dayScheduleEvents.length + dayTasks.length + dayHomework.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Navigation and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Навигация по датам */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="border-border bg-transparent"
          >
            Сегодня
          </Button>
        </div>

        {/* Фильтры и переключатель видов */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Calendar Filter */}
          <Select
            value={visibleCalendars.length === calendars.length ? "all" : visibleCalendars[0] || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                setVisibleCalendars(calendars.map((c) => c.id))
              } else {
                setVisibleCalendars([value])
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-40 bg-input border-border">
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

          {/* View Selector */}
          <div className="flex justify-between sm:justify-start rounded-lg border border-border bg-muted p-1 w-full sm:w-auto">
            <Button
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
              className="text-xs flex-1 sm:flex-none"
            >
              День
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className="text-xs flex-1 sm:flex-none"
            >
              Неделя
            </Button>
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
              className="text-xs flex-1 sm:flex-none"
            >
              Месяц
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {view === "day" && renderDayView()}
      {view === "week" && renderWeekView()}
      {view === "month" && renderMonthView()}
    </div>
  )
}
