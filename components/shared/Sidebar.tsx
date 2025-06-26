"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, Rocket, Users, Settings, HelpCircle, ChevronLeft, ChevronRight, Star, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Rocket, label: "Stations", href: "/stations" },
  { icon: Users, label: "Team", href: "/team" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
    router.push("/")
  }

  // Se não estiver autenticado, não mostra a sidebar
  if (!isAuthenticated) {
    return null
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`bg-space-800/50 border-r border-space-600 backdrop-blur-sm transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Orbitask</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left ${
                    isActive
                      ? "bg-cosmic-blue/20 text-cosmic-blue border-r-2 border-cosmic-blue"
                      : "text-gray-400 hover:text-white hover:bg-space-700/50"
                  } ${isCollapsed ? "px-2" : "px-4"}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        {!isCollapsed && user && (
          <div className="mt-auto space-y-2">
            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="ml-3">Logout</span>
            </Button>
            
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 bg-space-700/50 rounded-lg border border-space-600">
              <div className="w-8 h-8 bg-gradient-to-r from-cosmic-purple to-cosmic-cyan rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Profile */}
        {isCollapsed && user && (
          <div className="mt-auto space-y-2">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
            
            <div 
              className="w-8 h-8 bg-gradient-to-r from-cosmic-purple to-cosmic-cyan rounded-full flex items-center justify-center mx-auto"
              title={user.full_name}
            >
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}