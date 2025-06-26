"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, Send, X, Minimize2 } from "lucide-react"

export function OrbitAIWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I'm Orbit AI, your space mission assistant. How can I help you today?" },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessages = [
      ...messages,
      { role: "user", content: message },
      { role: "ai", content: "I'm processing your request. This is a demo response from Orbit AI!" },
    ]

    setMessages(newMessages)
    setMessage("")
  }

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-cyan hover:scale-110 transition-transform glow-purple"
        >
          <Brain className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80"
          >
            <Card className="bg-space-800/95 border-cosmic-purple backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cosmic-purple to-cosmic-cyan rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-white text-sm">Orbit AI</CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                    >
                      <Minimize2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="w-6 h-6 p-0 text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="pt-0">
                  {/* Messages */}
                  <div className="h-64 overflow-y-auto space-y-3 mb-4">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            msg.role === "user" ? "bg-cosmic-blue text-white" : "bg-space-700 text-gray-200"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask Orbit AI..."
                      className="bg-space-700 border-space-600 text-white placeholder:text-gray-400"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="sm"
                      className="bg-cosmic-purple hover:bg-cosmic-purple/80"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
