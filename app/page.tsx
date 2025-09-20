"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScheduleManager } from "@/components/schedule-manager"
import { TaskManager } from "@/components/task-manager"
import { HomeworkManager } from "@/components/homework-manager"
import { CalendarViews } from "@/components/calendar-views"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { WeekSettings } from "@/components/week-settings"

export default function GrowApp() {
  const [currentWeek, setCurrentWeek] = useState<"upper" | "lower">("upper")
  const [activeSection, setActiveSection] = useState("calendar")

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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MobileSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                currentWeek={currentWeek}
                setCurrentWeek={setCurrentWeek}
                weekType={weekType}
                customWeekNames={customWeekNames}
                weekInterval={weekInterval}
              />
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">G</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">Grow</h1>
            </div>

            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Добавить</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block md:w-80 flex-shrink-0">
            <MobileSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              currentWeek={currentWeek}
              setCurrentWeek={setCurrentWeek}
              weekType={weekType}
              customWeekNames={customWeekNames}
              weekInterval={weekInterval}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}
