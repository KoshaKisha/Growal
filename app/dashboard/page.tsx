"use client"

import { useState } from "react"
import { Plus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScheduleManager } from "@/components/schedule-manager"
import { TaskManager } from "@/components/task-manager"
import { HomeworkManager } from "@/components/homework-manager"
import { CalendarViews } from "@/components/calendar-views"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { WeekSettings } from "@/components/week-settings"

export default function DashboardPage() {
  const [currentWeek, setCurrentWeek] = useState<"upper" | "lower">("upper")
  const [activeSection, setActiveSection] = useState("calendar")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [weekType, setWeekType] = useState<"alternating" | "custom" | "none">("alternating")
  const [customWeekNames, setCustomWeekNames] = useState<string[]>(["Неделя А", "Неделя Б"])
  const [weekInterval, setWeekInterval] = useState(1)

  const renderContent = () => {
    switch (activeSection) {
      case "schedule":
        return <ScheduleManager />
      case "tasks":
        return <TaskManager />
      case "homework":
        return <HomeworkManager />
      case "settings":
        return (
          <WeekSettings
            weekType={weekType}
            setWeekType={setWeekType}
            customWeekNames={customWeekNames}
            setCustomWeekNames={setCustomWeekNames}
            weekInterval={weekInterval}
            setWeekInterval={setWeekInterval}
          />
        )
      default:
        return <CalendarViews currentWeek={currentWeek} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="hover:bg-primary/10 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center float-animation">
                <span className="text-primary-foreground font-bold text-lg">G</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Grow
              </h1>
            </div>

            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 pulse-glow rounded-xl shadow-lg"
            >
              <Plus className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Добавить</span>
            </Button>
          </div>
        </div>
      </header>

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentWeek={currentWeek}
        setCurrentWeek={setCurrentWeek}
        weekType={weekType}
        customWeekNames={customWeekNames}
        weekInterval={weekInterval}
      />

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  )
}
