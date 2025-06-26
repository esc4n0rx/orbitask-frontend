"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Users, Brain, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-700">
      {/* Header */}
      <header className="border-b border-space-600/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Orbitask</span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-cosmic-blue transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-cosmic-blue transition-colors">
              Pricing
            </a>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cosmic-blue via-cosmic-purple to-cosmic-cyan bg-clip-text text-transparent mb-6">
              Navigate Your Projects
              <br />
              Through the Cosmos
            </h1>
            <div className="absolute -top-4 -right-4 w-4 h-4 bg-cosmic-cyan rounded-full animate-pulse" />
            <div className="absolute top-1/2 -left-8 w-2 h-2 bg-cosmic-purple rounded-full animate-orbit" />
          </div>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Orbitask brings space-age project management to your team. Organize, collaborate, and launch your ideas into
            orbit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-cosmic-blue hover:bg-cosmic-blue/80 glow-blue">
                Start Your Mission
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Mission Control Features</h2>
          <p className="text-gray-300 text-lg">Everything you need to manage projects across the galaxy</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Rocket,
              title: "Kanban Boards",
              description: "Visualize your workflow with space-themed boards that keep your team aligned.",
              color: "cosmic-blue",
            },
            {
              icon: Users,
              title: "Team Stations",
              description: "Create dedicated workspaces for different teams and projects.",
              color: "cosmic-purple",
            },
            {
              icon: Brain,
              title: "Orbit AI Assistant",
              description: "Get intelligent insights and suggestions powered by AI.",
              color: "cosmic-cyan",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-space-800/50 border-space-600 hover:border-cosmic-blue/50 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 bg-${feature.color}/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-cosmic-blue/20 to-cosmic-purple/20 rounded-2xl p-12 border border-cosmic-blue/30"
        >
          <Star className="w-12 h-12 text-cosmic-cyan mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch?</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Join thousands of teams already managing their projects in orbit.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-cosmic-purple hover:bg-cosmic-purple/80 glow-purple">
              Start Free Mission
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-space-600/50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 Orbitask. All rights reserved. Made with 🚀 for space explorers.</p>
        </div>
      </footer>
    </div>
  )
}
