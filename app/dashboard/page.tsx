"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/shared/Sidebar"
import { StatsCard } from "@/components/shared/StatsCard"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { Rocket, Users, CheckCircle, Clock, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

const mockStats = {
  totalStations: 5,
  totalTasks: 42,
  completedTasks: 28,
  pendingTasks: 14,
}

const recentBoards = [
  { id: 1, name: "Mars Mission Planning", station: "NASA Station", progress: 75, color: "cosmic-blue" },
  { id: 2, name: "Satellite Deployment", station: "SpaceX Hub", progress: 45, color: "cosmic-purple" },
  { id: 3, name: "Moon Base Construction", station: "Lunar Station", progress: 90, color: "cosmic-cyan" },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-space-900">
      <Sidebar />

      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
              <p className="text-gray-400">Welcome back, Commander. Here's your mission status.</p>
            </div>
            <Link href="/stations">
              <Button className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                <Plus className="w-4 h-4 mr-2" />
                New Station
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Active Stations"
              value={mockStats.totalStations}
              icon={Rocket}
              color="cosmic-blue"
              trend="+2 this month"
            />
            <StatsCard
              title="Total Tasks"
              value={mockStats.totalTasks}
              icon={Users}
              color="cosmic-purple"
              trend="+12 this week"
            />
            <StatsCard
              title="Completed"
              value={mockStats.completedTasks}
              icon={CheckCircle}
              color="cosmic-cyan"
              trend="67% completion rate"
            />
            <StatsCard
              title="In Progress"
              value={mockStats.pendingTasks}
              icon={Clock}
              color="orange"
              trend="3 due today"
            />
          </div>

          {/* Recent Boards */}
          <Card className="bg-space-800/50 border-space-600 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Recent Mission Boards</CardTitle>
                <Link href="/stations">
                  <Button variant="ghost" size="sm" className="text-cosmic-blue hover:text-cosmic-blue/80">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBoards.map((board, index) => (
                  <motion.div
                    key={board.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-space-700/50 rounded-lg border border-space-600 hover:border-cosmic-blue/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 bg-${board.color} rounded-full`} />
                      <div>
                        <h3 className="text-white font-medium">{board.name}</h3>
                        <p className="text-gray-400 text-sm">{board.station}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-white text-sm">{board.progress}%</p>
                        <div className="w-20 h-2 bg-space-600 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${board.color} transition-all duration-300`}
                            style={{ width: `${board.progress}%` }}
                          />
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-space-800/50 border-space-600">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col border-cosmic-blue/30 hover:border-cosmic-blue hover:bg-cosmic-blue/10"
                >
                  <Rocket className="w-6 h-6 mb-2 text-cosmic-blue" />
                  <span className="text-white">Create Station</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col border-cosmic-purple/30 hover:border-cosmic-purple hover:bg-cosmic-purple/10"
                >
                  <Users className="w-6 h-6 mb-2 text-cosmic-purple" />
                  <span className="text-white">Invite Team</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col border-cosmic-cyan/30 hover:border-cosmic-cyan hover:bg-cosmic-cyan/10"
                >
                  <Plus className="w-6 h-6 mb-2 text-cosmic-cyan" />
                  <span className="text-white">New Board</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <OrbitAIWidget />
    </div>
  )
}
