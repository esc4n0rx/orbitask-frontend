"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import {
  Search,
  Book,
  MessageCircle,
  Video,
  FileText,
  ChevronRight,
  Star,
  Clock,
  Users,
  Rocket,
  Settings,
  Shield,
} from "lucide-react"

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Rocket,
    color: "cosmic-blue",
    articles: [
      { title: "Welcome to Orbitask", time: "5 min read", popular: true },
      { title: "Creating your first Station", time: "3 min read", popular: true },
      { title: "Setting up your team", time: "4 min read", popular: false },
      { title: "Understanding roles and permissions", time: "6 min read", popular: false },
    ],
  },
  {
    id: "project-management",
    title: "Project Management",
    icon: Users,
    color: "cosmic-purple",
    articles: [
      { title: "Creating and managing boards", time: "7 min read", popular: true },
      { title: "Using the Kanban system", time: "5 min read", popular: true },
      { title: "Task management best practices", time: "8 min read", popular: false },
      { title: "Setting up workflows", time: "6 min read", popular: false },
    ],
  },
  {
    id: "collaboration",
    title: "Team Collaboration",
    icon: MessageCircle,
    color: "cosmic-cyan",
    articles: [
      { title: "Commenting and mentions", time: "4 min read", popular: true },
      { title: "Real-time collaboration", time: "5 min read", popular: false },
      { title: "File sharing and attachments", time: "3 min read", popular: false },
      { title: "Team communication tips", time: "7 min read", popular: false },
    ],
  },
  {
    id: "settings",
    title: "Settings & Configuration",
    icon: Settings,
    color: "orange",
    articles: [
      { title: "Account settings", time: "3 min read", popular: false },
      { title: "Notification preferences", time: "4 min read", popular: true },
      { title: "Customizing your workspace", time: "5 min read", popular: false },
      { title: "Integration setup", time: "8 min read", popular: false },
    ],
  },
  {
    id: "security",
    title: "Security & Privacy",
    icon: Shield,
    color: "green",
    articles: [
      { title: "Two-factor authentication", time: "4 min read", popular: true },
      { title: "Data privacy and security", time: "6 min read", popular: false },
      { title: "Managing access permissions", time: "5 min read", popular: false },
      { title: "GDPR compliance", time: "7 min read", popular: false },
    ],
  },
]

const popularArticles = [
  { title: "How to create your first project board", category: "Getting Started", time: "5 min read" },
  { title: "Understanding task priorities and labels", category: "Project Management", time: "4 min read" },
  { title: "Setting up team notifications", category: "Settings", time: "3 min read" },
  { title: "Using Orbit AI for project insights", category: "AI Features", time: "6 min read" },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCategories = helpCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.articles.some((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="flex min-h-screen bg-space-900">
      <Sidebar />

      <main className="flex-1 p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">How can we help you?</h1>
            <p className="text-gray-400 text-lg mb-8">
              Find answers, guides, and resources to make the most of Orbitask
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search for help articles, guides, and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg bg-space-800 border-space-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-blue/50 transition-colors cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cosmic-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Book className="w-6 h-6 text-cosmic-blue" />
                </div>
                <h3 className="text-white font-medium mb-2">Documentation</h3>
                <p className="text-gray-400 text-sm">Complete guides and API references</p>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-purple/50 transition-colors cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cosmic-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6 text-cosmic-purple" />
                </div>
                <h3 className="text-white font-medium mb-2">Video Tutorials</h3>
                <p className="text-gray-400 text-sm">Step-by-step video guides</p>
              </CardContent>
            </Card>

            <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-cyan/50 transition-colors cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cosmic-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-cosmic-cyan" />
                </div>
                <h3 className="text-white font-medium mb-2">Contact Support</h3>
                <p className="text-gray-400 text-sm">Get help from our support team</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Help Categories */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
              <div className="space-y-4">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-blue/50 transition-colors">
                      <CardHeader
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 bg-${category.color}/20 rounded-lg flex items-center justify-center`}
                            >
                              <category.icon className={`w-5 h-5 text-${category.color}`} />
                            </div>
                            <CardTitle className="text-white">{category.title}</CardTitle>
                          </div>
                          <ChevronRight
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              selectedCategory === category.id ? "rotate-90" : ""
                            }`}
                          />
                        </div>
                      </CardHeader>

                      {selectedCategory === category.id && (
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {category.articles.map((article, articleIndex) => (
                              <motion.div
                                key={articleIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: articleIndex * 0.05 }}
                                className="flex items-center justify-between p-3 bg-space-700/50 rounded-lg hover:bg-space-700 transition-colors cursor-pointer group"
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <p className="text-white group-hover:text-cosmic-blue transition-colors">
                                      {article.title}
                                    </p>
                                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                                      <Clock className="w-3 h-3" />
                                      <span>{article.time}</span>
                                      {article.popular && (
                                        <>
                                          <span>•</span>
                                          <div className="flex items-center space-x-1">
                                            <Star className="w-3 h-3 text-yellow-500" />
                                            <span>Popular</span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cosmic-blue transition-colors" />
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Articles */}
              <Card className="bg-space-800/50 border-space-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Popular Articles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {popularArticles.map((article, index) => (
                      <div
                        key={index}
                        className="p-3 bg-space-700/50 rounded-lg hover:bg-space-700 transition-colors cursor-pointer group"
                      >
                        <p className="text-white text-sm group-hover:text-cosmic-blue transition-colors mb-1">
                          {article.title}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{article.category}</span>
                          <span>{article.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="bg-gradient-to-br from-cosmic-blue/20 to-cosmic-purple/20 border-cosmic-blue/30">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-cosmic-blue mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">Still need help?</h3>
                  <p className="text-gray-300 text-sm mb-4">Our support team is here to help you succeed</p>
                  <Button className="w-full bg-cosmic-blue hover:bg-cosmic-blue/80">Contact Support</Button>
                </CardContent>
              </Card>

              {/* Community */}
              <Card className="bg-space-800/50 border-space-600">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-cosmic-purple mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">Join the Community</h3>
                  <p className="text-gray-400 text-sm mb-4">Connect with other Orbitask users</p>
                  <Button
                    variant="outline"
                    className="w-full border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10"
                  >
                    Join Discord
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      <OrbitAIWidget />
    </div>
  )
}
