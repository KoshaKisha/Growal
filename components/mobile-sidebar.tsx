"use client"

import { useState, useEffect } from "react"
import { X, Calendar, CheckSquare, BookOpen, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MobileSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  currentWeek: string
  setCurrentWeek: (week: "upper" | "lower") => void
  weekType: "alternating" | "custom" | "none"
  customWeekNames: string[]
  weekInterval: number
}

export function MobileSidebar({
  activeSection,
  setActiveSection,
  currentWeek,
  setCurrentWeek,
  weekType,
  customWeekNames,
  weekInterval,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar")
      const menuButton = document.getElementById("menu-button")

      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

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
    setIsOpen(false)
  }

  return (
    <>
      <Button
        id="menu-button"
        variant="outline"
        size="sm"
        className="bg-card text-card-foreground border-border hover:bg-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-4 h-4" />
      </Button>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

      <div
        id="mobile-sidebar"
        className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-sidebar-border bg-sidebar-primary/10">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Grow</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-sidebar-foreground hover:bg-sidebar-primary/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Week Selector */}
            {weekType !== "none" && (
              <Card className="bg-sidebar-primary/20 border-sidebar-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-sidebar-foreground">Текущая неделя</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge
                    variant="secondary"
                    className="bg-sidebar-primary text-sidebar-primary-foreground mb-2 w-full justify-center"
                  >
                    {getWeekDisplay()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sidebar-foreground border-sidebar-border bg-transparent hover:bg-sidebar-primary/20"
                    onClick={() => setCurrentWeek(currentWeek === "upper" ? "lower" : "upper")}
                  >
                    Переключить
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <Card className="bg-sidebar-primary/10 border-sidebar-border">
              <CardHeader>
                <CardTitle className="text-sidebar-foreground">Навигация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeSection === "calendar" ? "default" : "ghost"}
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-primary/20"
                  onClick={() => handleSectionChange("calendar")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Календарь
                </Button>
                <Button
                  variant={activeSection === "schedule" ? "default" : "ghost"}
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-primary/20"
                  onClick={() => handleSectionChange("schedule")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Расписание
                </Button>
                <Button
                  variant={activeSection === "tasks" ? "default" : "ghost"}
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-primary/20"
                  onClick={() => handleSectionChange("tasks")}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Задачи
                </Button>
                <Button
                  variant={activeSection === "homework" ? "default" : "ghost"}
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-primary/20"
                  onClick={() => handleSectionChange("homework")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Домашние задания
                </Button>
                <Button
                  variant={activeSection === "settings" ? "default" : "ghost"}
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-primary/20"
                  onClick={() => handleSectionChange("settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-sidebar-primary/10 border-sidebar-border">
              <CardHeader>
                <CardTitle className="text-sidebar-foreground text-sm">Сегодня</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sidebar-foreground/70">Пары</span>
                  <Badge className="bg-chart-1 text-foreground">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sidebar-foreground/70">Задачи</span>
                  <Badge className="bg-chart-2 text-foreground">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sidebar-foreground/70">ДЗ</span>
                  <Badge className="bg-chart-3 text-foreground">2</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
