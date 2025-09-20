"use client"

import { useEffect } from "react"
import { X, Calendar, CheckSquare, BookOpen, Settings, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  setActiveSection: (section: string) => void
  currentWeek: string
  setCurrentWeek: (week: "upper" | "lower") => void
  weekType: "alternating" | "custom" | "none"
  customWeekNames: string[]
  weekInterval: number
}

export function MobileSidebar({
  isOpen,
  onClose,
  activeSection,
  setActiveSection,
  currentWeek,
  setCurrentWeek,
  weekType,
  customWeekNames,
  weekInterval,
}: MobileSidebarProps) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar")

      if (isOpen && sidebar && !sidebar.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const getWeekDisplay = () => {
    if (weekType === "none") return "Обычная неделя"
    if (weekType === "custom" && customWeekNames.length > 0) {
      const weekIndex = currentWeek === "upper" ? 0 : 1
      return customWeekNames[weekIndex] || "Неделя"
    }
    return currentWeek === "upper" ? "Верхняя неделя" : "Нижняя неделя"
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-md transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        id="mobile-sidebar"
        className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-sidebar border-r border-sidebar-border z-50 transform transition-all duration-300 ease-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-sidebar-border bg-gradient-to-r from-sidebar-primary/20 to-sidebar-accent/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-bold text-sidebar-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Grow
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-sidebar-foreground hover:bg-sidebar-primary/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {weekType !== "none" && (
              <Card className="bg-gradient-to-br from-sidebar-primary/20 to-sidebar-accent/10 border-sidebar-border card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-sidebar-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Текущая неделя
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground mb-3 w-full justify-center py-2 rounded-xl shadow-sm"
                  >
                    {getWeekDisplay()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sidebar-foreground border-sidebar-border bg-transparent hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-105"
                    onClick={() => setCurrentWeek(currentWeek === "upper" ? "lower" : "upper")}
                  >
                    Переключить
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-sidebar-primary/10 to-sidebar-accent/5 border-sidebar-border card-hover">
              <CardHeader>
                <CardTitle className="text-sidebar-foreground">Навигация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeSection === "calendar" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl transition-all duration-200 hover:scale-105 ${
                    activeSection === "calendar"
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-primary/10"
                  }`}
                  onClick={() => handleSectionChange("calendar")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Календарь
                </Button>
                <Button
                  variant={activeSection === "schedule" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl transition-all duration-200 hover:scale-105 ${
                    activeSection === "schedule"
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-primary/10"
                  }`}
                  onClick={() => handleSectionChange("schedule")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Расписание
                </Button>
                <Button
                  variant={activeSection === "tasks" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl transition-all duration-200 hover:scale-105 ${
                    activeSection === "tasks"
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-primary/10"
                  }`}
                  onClick={() => handleSectionChange("tasks")}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Задачи
                </Button>
                <Button
                  variant={activeSection === "homework" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl transition-all duration-200 hover:scale-105 ${
                    activeSection === "homework"
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-primary/10"
                  }`}
                  onClick={() => handleSectionChange("homework")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Домашние задания
                </Button>
                <Button
                  variant={activeSection === "settings" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl transition-all duration-200 hover:scale-105 ${
                    activeSection === "settings"
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-primary/10"
                  }`}
                  onClick={() => handleSectionChange("settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sidebar-primary/10 to-sidebar-accent/5 border-sidebar-border card-hover">
              <CardHeader>
                <CardTitle className="text-sidebar-foreground text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Сегодня
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sidebar-foreground/70">Пары</span>
                  <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-foreground rounded-full px-3 py-1 shadow-sm">
                    3
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sidebar-foreground/70">Задачи</span>
                  <Badge className="bg-gradient-to-r from-chart-2 to-chart-3 text-foreground rounded-full px-3 py-1 shadow-sm">
                    5
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sidebar-foreground/70">ДЗ</span>
                  <Badge className="bg-gradient-to-r from-chart-3 to-chart-4 text-foreground rounded-full px-3 py-1 shadow-sm">
                    2
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
