"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Mail, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { loginUser } from "@/lib/api/auth"
import { setStoredToken, setStoredUser, getStoredToken } from "@/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await loginUser({ email, password })
      
      // Armazenar dados localmente
      setStoredToken(response.token)
      setStoredUser(response.user)
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${response.user.full_name}!`,
      })
      
      // Redirecionar para dashboard
      router.push("/dashboard")
      
      // Recarregar a página para inicializar o contexto de auth
      window.location.href = "/dashboard"
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mostrar loading enquanto verifica autenticação
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-700 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <div className="w-8 h-8 border-2 border-cosmic-blue border-t-transparent rounded-full animate-spin" />
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
            <div className="w-12 h-12 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Welcome Back, Astronaut</CardTitle>
            <p className="text-gray-400">Sign in to continue your mission</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="astronaut@orbitask.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-space-700 border-space-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-cosmic-blue hover:bg-cosmic-blue/80 glow-blue"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Launching...
                  </div>
                ) : (
                  "Launch Mission"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                New to Orbitask?{" "}
                <Link href="/auth/register" className="text-cosmic-blue hover:text-cosmic-blue/80">
                  Join the crew
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}