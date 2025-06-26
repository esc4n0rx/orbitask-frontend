"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { CreateStationModal } from "@/components/modals/CreateStationModal"
import { Rocket, Users, Calendar, Plus, Settings, Star } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

const mockStations = [
  {
    id: 1,
    name: "NASA Mission Control",
    description: "Primary station for Mars exploration missions",
    role: "owner",
    members: 12,
    boards: 5,
    lastActivity: "2 hours ago",
    color: "cosmic-blue",
  },
  {
    id: 2,
    name: "SpaceX Hub",
    description: "Satellite deployment and rocket development",
    role: "admin",
    members: 8,
    boards: 3,
    lastActivity: "1 day ago",
    color: "cosmic-purple",
  },
  {
    id: 3,
    name: "Lunar Station Alpha",
    description: "Moon base construction and research",
    role: "leader",
    members: 15,
    boards: 7,
    lastActivity: "3 hours ago",
    color: "cosmic-cyan",
  },
  {
    id: 4,
    name: "ISS Operations",
    description: "International Space Station daily operations",
    role: "member",
    members: 6,
    boards: 2,
    lastActivity: "5 hours ago",
    color: "orange",
  },
]

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "owner":
      return "bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/30"
    case "admin":
      return "bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/30"
    case "leader":
      return "bg-cosmic-cyan/20 text-cosmic-cyan border-cosmic-cyan/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export default function StationsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
   <ProtectedRoute>
    <div className="flex min-h-screen bg-space-900">
      <Sidebar />

      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Space Stations</h1>
              <p className="text-gray-400">Manage your mission control centers</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-cosmic-blue hover:bg-cosmic-blue/80">
              <Plus className="w-4 h-4 mr-2" />
              New Station
            </Button>
          </div>

          {/* Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockStations.map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-blue/50 transition-all duration-300 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={`w-12 h-12 bg-${station.color}/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <Rocket className={`w-6 h-6 text-${station.color}`} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleBadgeColor(station.role)}>{station.role}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{station.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{station.description}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{station.members} members</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Star className="w-4 h-4" />
                          <span>{station.boards} boards</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Active {station.lastActivity}</span>
                      </div>

                      <div className="pt-2 border-t border-space-600">
                        <Button
                          variant="ghost"
                          className="w-full text-cosmic-blue hover:text-cosmic-blue/80 hover:bg-cosmic-blue/10"
                        >
                          Enter Station
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Create New Station Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: mockStations.length * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                className="bg-space-800/30 border-2 border-dashed border-space-600 hover:border-cosmic-blue/50 transition-colors cursor-pointer group"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-cosmic-blue/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-cosmic-blue" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Create New Station</h3>
                  <p className="text-gray-400 text-sm">Start a new mission control center</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <OrbitAIWidget />
      <CreateStationModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
    </ProtectedRoute>
  )
}
