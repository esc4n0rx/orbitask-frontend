"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, Rocket, Users, Settings, HelpCircle, ChevronLeft, ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`bg-space-800/50 border-r border-space-600 backdrop-blur-sm transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4">
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
        <nav className="space-y-2">
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
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-3 p-3 bg-space-700/50 rounded-lg border border-space-600">
              <div className="w-8 h-8 bg-gradient-to-r from-cosmic-purple to-cosmic-cyan rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Commander Neil</p>
                <p className="text-xs text-gray-400 truncate">neil@orbitask.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
