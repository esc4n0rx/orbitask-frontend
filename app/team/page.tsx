"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { InviteMemberModal } from "@/components/modals/InviteMemberModal"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Users, UserPlus, Search, MoreVertical, Mail, Calendar, Shield, Crown, Star, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Forçar renderização dinâmica para evitar problemas de pré-renderização
export const dynamic = 'force-dynamic'

const mockTeamMembers = [
  {
    id: 1,
    name: "Neil Armstrong",
    email: "neil@orbitask.com",
    role: "owner",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    tasksCompleted: 45,
    stations: ["NASA Mission Control", "Apollo Program"],
    status: "online",
  },
  {
    id: 2,
    name: "Buzz Aldrin",
    email: "buzz@orbitask.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-01-20",
    lastActive: "1 day ago",
    tasksCompleted: 32,
    stations: ["NASA Mission Control", "Lunar Station Alpha"],
    status: "away",
  },
  {
    id: 3,
    name: "Sally Ride",
    email: "sally@orbitask.com",
    role: "leader",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-02-01",
    lastActive: "5 minutes ago",
    tasksCompleted: 28,
    stations: ["SpaceX Hub", "ISS Operations"],
    status: "online",
  },
  {
    id: 4,
    name: "John Glenn",
    email: "john@orbitask.com",
    role: "member",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-02-10",
    lastActive: "3 hours ago",
    tasksCompleted: 15,
    stations: ["ISS Operations"],
    status: "offline",
  },
  {
    id: 5,
    name: "Mae Jemison",
    email: "mae@orbitask.com",
    role: "member",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "2024-02-15",
    lastActive: "30 minutes ago",
    tasksCompleted: 22,
    stations: ["Lunar Station Alpha", "Mars Research"],
    status: "online",
  },
]

const getRoleIcon = (role: string) => {
  switch (role) {
    case "owner":
      return Crown
    case "admin":
      return Shield
    case "leader":
      return Star
    default:
      return User
  }
}

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-green-500"
    case "away":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("all")

  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
  <ProtectedRoute>
    <div className="flex min-h-screen bg-space-900">
      <Sidebar />

      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
              <p className="text-gray-400">Manage your crew members and their permissions</p>
            </div>
            <Button onClick={() => setIsInviteModalOpen(true)} className="bg-cosmic-blue hover:bg-cosmic-blue/80">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Members</p>
                    <p className="text-2xl font-bold text-white">{mockTeamMembers.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-cosmic-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Online Now</p>
                    <p className="text-2xl font-bold text-white">
                      {mockTeamMembers.filter((m) => m.status === "online").length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Tasks Completed</p>
                    <p className="text-2xl font-bold text-white">
                      {mockTeamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-cosmic-cyan" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg. Performance</p>
                    <p className="text-2xl font-bold text-white">94%</p>
                  </div>
                  <Crown className="w-8 h-8 text-cosmic-purple" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-space-800 border-space-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center space-x-2">
                {["all", "owner", "admin", "leader", "member"].map((role) => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRole(role)}
                    className={
                      selectedRole === role
                        ? "bg-cosmic-blue hover:bg-cosmic-blue/80"
                        : "border-space-600 text-gray-300 hover:bg-space-700"
                    }
                  >
                    {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => {
              const RoleIcon = getRoleIcon(member.role)
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-blue/50 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-space-800`}
                            />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{member.name}</h3>
                            <p className="text-gray-400 text-sm">{member.email}</p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-space-700 border-space-600">
                            <DropdownMenuItem className="text-white hover:bg-space-600">View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-space-600">Send Message</DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-space-600">Change Role</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Role Badge */}
                        <div className="flex items-center justify-between">
                          <Badge className={getRoleBadgeColor(member.role)}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role}
                          </Badge>
                          <span className="text-xs text-gray-400 capitalize">{member.status}</span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Tasks Done</p>
                            <p className="text-white font-medium">{member.tasksCompleted}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Stations</p>
                            <p className="text-white font-medium">{member.stations.length}</p>
                          </div>
                        </div>

                        {/* Join Date and Last Active */}
                        <div className="space-y-2 text-xs text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3" />
                            <span>Active {member.lastActive}</span>
                          </div>
                        </div>

                        {/* Stations */}
                        <div>
                          <p className="text-xs text-gray-400 mb-2">Active Stations</p>
                          <div className="flex flex-wrap gap-1">
                            {member.stations.slice(0, 2).map((station) => (
                              <span
                                key={station}
                                className="text-xs bg-cosmic-blue/20 text-cosmic-blue px-2 py-1 rounded-full"
                              >
                                {station}
                              </span>
                            ))}
                            {member.stations.length > 2 && (
                              <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full">
                                +{member.stations.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </main>

      <OrbitAIWidget />
      <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
    </div>
  </ProtectedRoute>
  )
}