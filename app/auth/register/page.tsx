"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowLeft, Sparkles, Check } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "password") {
      let strength = 0
      if (value.length >= 8) strength++
      if (/[A-Z]/.test(value)) strength++
      if (/[a-z]/.test(value)) strength++
      if (/[0-9]/.test(value)) strength++
      if (/[^A-Za-z0-9]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Ошибка регистрации")
      return
    }

    console.log("Регистрация успешна:", data)
    window.location.href = "/auth/login"
  } catch (err) {
    console.error(err)
    alert("Что-то пошло не так")
  } finally {
    setIsLoading(false)
  }
}

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-400"
    if (passwordStrength <= 3) return "bg-yellow-400"
    return "bg-green-400"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Слабый"
    if (passwordStrength <= 3) return "Средний"
    return "Сильный"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-green via-warm-beige to-soft-pink flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-36 h-36 bg-dusty-rose/20 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-16 w-28 h-28 bg-muted-blue/20 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-warm-beige/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-charcoal/70 hover:text-charcoal transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Назад к приложению
        </Link>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sage-green to-muted-blue rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-charcoal">Создать аккаунт</CardTitle>
              <CardDescription className="text-charcoal/60 mt-2">
                Присоединяйтесь к Grow и начните планировать эффективно
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-charcoal font-medium">
                  Полное имя
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 border-2 border-muted-blue/20 focus:border-sage-green transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-charcoal font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 border-2 border-muted-blue/20 focus:border-sage-green transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-charcoal font-medium">
                  Пароль
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Создайте надежный пароль"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-12 border-2 border-muted-blue/20 focus:border-sage-green transition-colors pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/50 hover:text-charcoal transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-charcoal/60">{getPasswordStrengthText()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-charcoal font-medium">
                  Подтвердите пароль
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Повторите пароль"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="h-12 border-2 border-muted-blue/20 focus:border-sage-green transition-colors pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/50 hover:text-charcoal transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Пароли совпадают</span>
                      </>
                    ) : (
                      <span className="text-red-500">Пароли не совпадают</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 text-sm text-charcoal/70">
                  <input type="checkbox" className="mt-0.5 rounded border-muted-blue/30" required />
                  <span>
                    Я согласен с{" "}
                    <Link href="/terms" className="text-dusty-rose hover:text-orange-accent transition-colors">
                      условиями использования
                    </Link>{" "}
                    и{" "}
                    <Link href="/privacy" className="text-dusty-rose hover:text-orange-accent transition-colors">
                      политикой конфиденциальности
                    </Link>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || formData.password !== formData.confirmPassword}
                className="w-full h-12 bg-gradient-to-r from-sage-green to-muted-blue hover:from-sage-green/90 hover:to-muted-blue/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Создание аккаунта...
                  </div>
                ) : (
                  "Создать аккаунт"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-charcoal/60">
                Уже есть аккаунт?{" "}
                <Link
                  href="/auth/login"
                  className="text-sage-green hover:text-muted-blue font-medium transition-colors"
                >
                  Войти
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
