"use client"

import { useState } from "react"
import { ArrowRight, Calendar, CheckCircle, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandingPageForm() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: Calendar,
      title: "Умное расписание",
      description: "Поддержка чередующихся недель и гибких интервалов",
    },
    {
      icon: CheckCircle,
      title: "Управление задачами",
      description: "Организуйте разовые задачи по цветным календарям",
    },
    {
      icon: Users,
      title: "Домашние задания",
      description: "Автоматическая привязка к расписанию занятий",
    },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center float-animation">
                <span className="text-primary-foreground font-bold text-xl">G</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Grow
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="hover:bg-primary/10">
                  Войти
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 pulse-glow rounded-xl">
                  Начать
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce">
              <Sparkles className="w-4 h-4" />
              Планирование нового поколения
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Организуй свою учёбу с{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                умом
              </span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Grow — это современное приложение для планирования, созданное специально для студентов и преподавателей.
              Управляй расписанием, задачами и домашними заданиями в одном месте.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 pulse-glow rounded-xl text-lg px-8 py-4"
                >
                  Начать бесплатно
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/20 hover:bg-primary/5 rounded-xl text-lg px-8 py-4 bg-transparent"
              >
                Посмотреть демо
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-20">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 ${
                    hoveredFeature === index ? "transform scale-105" : ""
                  }`}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 mx-auto">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-8 border-t border-border/50">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Grow. Создано для эффективного обучения.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
