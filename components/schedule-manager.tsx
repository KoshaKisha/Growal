"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Clock, MapPin } from "lucide-react"
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
import {
  fetchScheduleEvents,
  createScheduleEvent,
  updateScheduleEvent,
  deleteScheduleEvent,
} from "@/lib/api/schedule"

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

const COLORS = [
  { name: "Бежевый", value: "#f5f5dc" },
  { name: "Розовый", value: "#e0bbd4" },
  { name: "Голубой", value: "#add8e6" },
  { name: "Коралловый", value: "#ff6f61" },
  { name: "Лавандовый", value: "#e6e6fa" },
  { name: "Мятный", value: "#f0fff0" },
]

const DAYS = [
  { id: "monday", name: "Понедельник" },
  { id: "tuesday", name: "Вторник" },
  { id: "wednesday", name: "Среда" },
  { id: "thursday", name: "Четверг" },
  { id: "friday", name: "Пятница" },
  { id: "saturday", name: "Суббота" },
  { id: "sunday", name: "Воскресенье" },
]

export function ScheduleManager() {
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    weekType: "both",
    days: [] as string[],
    color: COLORS[0].value,
  })

   const loadEvents = async () => {
    setIsLoading(true)
    try {
      const data = await fetchScheduleEvents()
      setEvents(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  // Сброс формы
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      startTime: "",
      endTime: "",
      weekType: "both",
      days: [],
      color: COLORS[0].value,
    })
    setEditingEvent(null)
    setIsDialogOpen(false)
  }

  // Создание или редактирование события
  const handleSubmit = async () => {
    if (!formData.title || !formData.startTime || !formData.endTime || formData.days.length === 0) return

    try {
      if (editingEvent) {
        await updateScheduleEvent(editingEvent.id, formData)
      } else {
        await createScheduleEvent(formData)
      }
      await loadEvents()
      resetForm()
    } catch (err) {
      console.error("Ошибка при сохранении события:", err)
    }
  }

  // Редактирование события
  const handleEdit = (event: ScheduleEvent) => {
    setEditingEvent(event)
    setFormData({ ...event })
    setIsDialogOpen(true)
  }

  // Удаление события
  const handleDelete = async (id: string) => {
    if (!confirm("Удалить событие?")) return
    try {
      await deleteScheduleEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error("Ошибка при удалении события:", err)
    }
  }

  // Переключение дней недели
  const handleDayToggle = (dayId: string) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(dayId) ? prev.days.filter((d) => d !== dayId) : [...prev.days, dayId],
    }))
  }

  const getWeekTypeLabel = (weekType: string) => {
    switch (weekType) {
      case "both": return "Каждая неделя"
      case "upper": return "Верхняя неделя"
      case "lower": return "Нижняя неделя"
      case "custom": return "Произвольный цикл"
      default: return weekType
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Постоянное расписание</h2>
          <p className="text-muted-foreground">Управление повторяющимися событиями и парами</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Добавить событие
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">
                {editingEvent ? "Редактировать событие" : "Новое событие"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Создайте повторяющееся событие в расписании
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-card-foreground">
                    Название
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Математический анализ"
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-card-foreground">
                    Место
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Аудитория 205"
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-card-foreground">
                  Описание
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Дополнительная информация о событии"
                  className="bg-input border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-card-foreground">
                    Время начала
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-card-foreground">
                    Время окончания
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Тип недели</Label>
                <Select
                  value={formData.weekType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, weekType: value }))}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="both">Каждая неделя</SelectItem>
                    <SelectItem value="upper">Верхняя неделя</SelectItem>
                    <SelectItem value="lower">Нижняя неделя</SelectItem>
                    <SelectItem value="custom">Произвольный цикл</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Дни недели</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={formData.days.includes(day.id)}
                        onCheckedChange={() => handleDayToggle(day.id)}
                      />
                      <Label htmlFor={day.id} className="text-sm text-card-foreground">
                        {day.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Цвет</Label>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color.value ? "border-ring" : "border-border"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm} className="border-border bg-transparent">
                Отмена
              </Button>
              <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {editingEvent ? "Сохранить" : "Создать"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-4 h-16 rounded-full" style={{ backgroundColor: event.color }} />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-card-foreground">{event.title}</h3>
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        {getWeekTypeLabel(event.weekType)}
                      </Badge>
                    </div>

                    {event.description && <p className="text-sm text-muted-foreground mb-2">{event.description}</p>}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.startTime} - {event.endTime}
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 mt-2">
                      {event.days.map((dayId) => {
                        const day = DAYS.find((d) => d.id === dayId)
                        return (
                          <Badge key={dayId} variant="outline" className="text-xs">
                            {day?.name.slice(0, 2)}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(event)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
