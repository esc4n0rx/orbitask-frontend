"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Mail, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/lib/api/auth"
import { setStoredToken, setStoredUser, getStoredToken } from "@/lib/auth"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Verificar se já está logado
  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      router.push("/dashboard")
    } else {
      setIsCheckingAuth(false)
    }
  }, [router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro na validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro na validação",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await registerUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      })
      
      // Armazenar dados localmente
      setStoredToken(response.token)
      setStoredUser(response.user)
      
      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo à Orbitask, ${response.user.full_name}!`,
      })
      
      // Redirecionar para dashboard
      router.push("/dashboard")
      
      // Recarregar a página para inicializar o contexto de auth
      window.location.href = "/dashboard"
    } catch (error: any) {
      toast({
        title: "Erro no registro",
        description: error.message || "Erro ao criar conta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Mostrar loading enquanto verifica autenticação
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-700 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <div className="w-8 h-8 border-2 border-cosmic-purple border-t-transparent rounded-full animate-spin" />
          <span>Verificando autenticação...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center text-cosmic-blue hover:text-cosmic-blue/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="bg-space-800/50 border-space-600 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-cosmic-purple to-cosmic-cyan rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Join the Crew</CardTitle>
            <p className="text-gray-400">Start your space mission today</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Neil Armstrong"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    className="pl-10 bg-space-700 border-space-600 text-white placeholder:text-gray-400"
                    required
                    minLength={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="astronaut@orbitask.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-space-700 border-space-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 bg-space-700 border-space-600 text-white placeholder:text-gray-400"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 bg-space-700 border-space-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-cosmic-purple hover:bg-cosmic-purple/80 glow-purple"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Preparing Launch...
                  </div>
                ) : (
                  "Begin Mission"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-cosmic-purple hover:text-cosmic-purple/80">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}