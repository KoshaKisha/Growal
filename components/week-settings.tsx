"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface WeekSettingsProps {
  weekType: "alternating" | "custom" | "none"
  setWeekType: (type: "alternating" | "custom" | "none") => void
  customWeekNames: string[]
  setCustomWeekNames: (names: string[]) => void
  weekInterval: number
  setWeekInterval: (interval: number) => void
}

export function WeekSettings({
  weekType,
  setWeekType,
  customWeekNames,
  setCustomWeekNames,
  weekInterval,
  setWeekInterval,
}: WeekSettingsProps) {
  const [newWeekName, setNewWeekName] = useState("")

  const addWeekName = () => {
    if (newWeekName.trim() && customWeekNames.length < 10) {
      setCustomWeekNames([...customWeekNames, newWeekName.trim()])
      setNewWeekName("")
    }
  }

  const removeWeekName = (index: number) => {
    setCustomWeekNames(customWeekNames.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Настройки чередования недель</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="week-type" className="text-card-foreground">
              Тип чередования
            </Label>
            <Select value={weekType} onValueChange={(value: "alternating" | "custom" | "none") => setWeekType(value)}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Выберите тип чередования" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="none">Без чередования</SelectItem>
                <SelectItem value="alternating">Верхняя/Нижняя неделя</SelectItem>
                <SelectItem value="custom">Пользовательские названия</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {weekType !== "none" && (
            <div className="space-y-2">
              <Label htmlFor="week-interval" className="text-card-foreground">
                Интервал чередования (недель)
              </Label>
              <Input
                id="week-interval"
                type="number"
                min="1"
                max="52"
                value={weekInterval}
                onChange={(e) => setWeekInterval(Number.parseInt(e.target.value) || 1)}
                className="bg-input border-border text-foreground"
              />
              <p className="text-sm text-muted-foreground">
                Каждые {weekInterval} {weekInterval === 1 ? "неделю" : weekInterval < 5 ? "недели" : "недель"}{" "}
                происходит смена
              </p>
            </div>
          )}

          {weekType === "custom" && (
            <div className="space-y-3">
              <Label className="text-card-foreground">Названия недель</Label>

              <div className="flex gap-2">
                <Input
                  placeholder="Название недели"
                  value={newWeekName}
                  onChange={(e) => setNewWeekName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addWeekName()}
                  className="bg-input border-border text-foreground"
                />
                <Button
                  onClick={addWeekName}
                  disabled={!newWeekName.trim() || customWeekNames.length >= 10}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {customWeekNames.map((name, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground flex items-center gap-1"
                  >
                    {name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeWeekName(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              {customWeekNames.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Добавьте названия для ваших недель (например: "Неделя А", "Неделя Б")
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
