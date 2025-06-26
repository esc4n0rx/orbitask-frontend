"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { CreateBoardModal } from "@/components/modals/CreateBoardModal"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import {
  Plus,
  Settings,
  Users,
  Calendar,
  Star,
  MoreVertical,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = 'force-dynamic'

// Mock data for station
const mockStation = {
  id: 1,
  name: "NASA Mission Control",
  description: "Primary station for Mars exploration missions and space research",
  role: "owner",
  members: 12,
  createdAt: "2024-01-15",
  color: "cosmic-blue",
}

const mockBoards = [
  {
    id: 1,
    name: "Mars Mission Planning",
    description: "Planning and coordination for the upcoming Mars mission",
    progress: 75,
    totalTasks: 24,
    completedTasks: 18,
    members: [
      { name: "Neil Armstrong", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Buzz Aldrin", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Sally Ride", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    lastActivity: "2 hours ago",
    dueDate: "2024-03-15",
    priority: "high",
    color: "cosmic-blue",
  },
  {
    id: 2,
    name: "Satellite Deployment",
    description: "Coordination for satellite launch and deployment procedures",
    progress: 45,
    totalTasks: 16,
    completedTasks: 7,
    members: [
      { name: "John Glenn", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Mae Jemison", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    lastActivity: "1 day ago",
    dueDate: "2024-04-20",
    priority: "medium",
    color: "cosmic-purple",
  },
  {
    id: 3,
    name: "Equipment Maintenance",
    description: "Regular maintenance and inspection of space equipment",
    progress: 90,
    totalTasks: 12,
    completedTasks: 11,
    members: [{ name: "Sally Ride", avatar: "/placeholder.svg?height=32&width=32" }],
    lastActivity: "3 hours ago",
    dueDate: "2024-02-28",
    priority: "low",
    color: "cosmic-cyan",
  },
  {
    id: 4,
    name: "Research Documentation",
    description: "Documenting research findings and mission reports",
    progress: 30,
    totalTasks: 20,
    completedTasks: 6,
    members: [
      { name: "Neil Armstrong", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "John Glenn", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Mae Jemison", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    lastActivity: "5 hours ago",
    dueDate: "2024-05-10",
    priority: "medium",
    color: "orange",
  },
]

const mockRecentActivity = [
  { user: "Neil Armstrong", action: "completed task", target: "Design Mars Rover", time: "2 hours ago" },
  { user: "Sally Ride", action: "commented on", target: "Launch Sequence Review", time: "4 hours ago" },
  { user: "Buzz Aldrin", action: "created board", target: "Mission Control Systems", time: "1 day ago" },
  { user: "Mae Jemison", action: "updated task", target: "Equipment Check", time: "2 days ago" },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export default function StationDetailPage() {
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false)

  return (
  <ProtectedRoute>
    <div className="flex min-h-screen bg-space-900">
      <Sidebar />

      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Station Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 bg-${mockStation.color}/20 rounded-xl flex items-center justify-center`}>
                <Star className={`w-8 h-8 text-${mockStation.color}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{mockStation.name}</h1>
                <p className="text-gray-400">{mockStation.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{mockStation.members} members</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Created {new Date(mockStation.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-space-600 text-gray-300">
                <Users className="w-4 h-4 mr-2" />
                Members
              </Button>
              <Button variant="outline" size="sm" className="border-space-600 text-gray-300">
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setIsCreateBoardModalOpen(true)}
                className="bg-cosmic-blue hover:bg-cosmic-blue/80"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Board
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Boards</p>
                    <p className="text-2xl font-bold text-white">{mockBoards.length}</p>
                  </div>
                  <Star className="w-8 h-8 text-cosmic-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Tasks</p>
                    <p className="text-2xl font-bold text-white">
                      {mockBoards.reduce((sum, board) => sum + board.totalTasks, 0)}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-cosmic-purple" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-white">
                      {mockBoards.reduce((sum, board) => sum + board.completedTasks, 0)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-cosmic-cyan" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg. Progress</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(mockBoards.reduce((sum, board) => sum + board.progress, 0) / mockBoards.length)}%
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Boards Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Mission Boards</h2>
                <Button variant="outline" size="sm" className="border-space-600 text-gray-300">
                  View All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockBoards.map((board, index) => (
                  <motion.div
                    key={board.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link href={`/stations/${mockStation.id}/boards/${board.id}`}>
                      <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-blue/50 transition-all duration-300 cursor-pointer group h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div
                              className={`w-10 h-10 bg-${board.color}/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                            >
                              <Star className={`w-5 h-5 text-${board.color}`} />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(board.priority)}>{board.priority}</Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-space-700 border-space-600">
                                  <DropdownMenuItem className="text-white hover:bg-space-600">
                                    Edit Board
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-white hover:bg-space-600">
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-white hover:bg-space-600">Archive</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <CardTitle className="text-white text-lg">{board.name}</CardTitle>
                          <p className="text-gray-400 text-sm">{board.description}</p>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-4">
                            {/* Progress */}
                            <div>
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-white">{board.progress}%</span>
                              </div>
                              <div className="w-full h-2 bg-space-600 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-${board.color} transition-all duration-300`}
                                  style={{ width: `${board.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Tasks */}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2 text-gray-400">
                                <CheckCircle className="w-4 h-4" />
                                <span>
                                  {board.completedTasks}/{board.totalTasks} tasks
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Due {new Date(board.dueDate).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Members */}
                            <div className="flex items-center justify-between">
                              <div className="flex -space-x-2">
                                {board.members.slice(0, 3).map((member, idx) => (
                                  <Avatar key={idx} className="w-6 h-6 border-2 border-space-800">
                                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {board.members.length > 3 && (
                                  <div className="w-6 h-6 bg-space-600 rounded-full border-2 border-space-800 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">+{board.members.length - 3}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{board.lastActivity}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}

                {/* Create New Board Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: mockBoards.length * 0.1 }}
                >
                  <Card
                    className="bg-space-800/30 border-2 border-dashed border-space-600 hover:border-cosmic-blue/50 transition-colors cursor-pointer group h-full"
                    onClick={() => setIsCreateBoardModalOpen(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="w-16 h-16 bg-cosmic-blue/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8 text-cosmic-blue" />
                      </div>
                      <h3 className="text-white font-medium mb-2">Create New Board</h3>
                      <p className="text-gray-400 text-sm">Start a new mission board</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Recent Activity Sidebar */}
            <div className="space-y-6">
              <Card className="bg-space-800/50 border-space-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-cosmic-blue" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
                            {activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">
                            <span className="font-medium">{activity.user}</span>{" "}
                            <span className="text-gray-400">{activity.action}</span>{" "}
                            <span className="text-cosmic-blue">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gradient-to-br from-cosmic-blue/20 to-cosmic-purple/20 border-cosmic-blue/30">
                <CardContent className="p-6">
                  <h3 className="text-white font-medium mb-4">Station Performance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Tasks This Week</span>
                      <span className="text-white font-medium">+12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Completion Rate</span>
                      <span className="text-green-400 font-medium">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Team Velocity</span>
                      <span className="text-cosmic-cyan font-medium">High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      <OrbitAIWidget />
      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        stationId={mockStation.id}
      />
    </div>
    </ProtectedRoute>
  )
}