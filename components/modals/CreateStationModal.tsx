"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Rocket, Palette } from "lucide-react"

interface CreateStationModalProps {
  isOpen: boolean
  onClose: () => void
  onStationCreated?: () => void
}

const colorOptions = [
  { name: "Cosmic Blue", value: "cosmic-blue", color: "#64b5f6" },
  { name: "Cosmic Purple", value: "cosmic-purple", color: "#ba68c8" },
  { name: "Cosmic Cyan", value: "cosmic-cyan", color: "#4dd0e1" },
  { name: "Solar Orange", value: "orange", color: "#ff9800" },
  { name: "Nebula Pink", value: "pink", color: "#f48fb1" },
  { name: "Galaxy Green", value: "green", color: "#81c784" },
]

export function CreateStationModal({ isOpen, onClose }: CreateStationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "cosmic-blue",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      onClose()
      // Reset form
      setFormData({ name: "", description: "", color: "cosmic-blue" })
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-space-800 border-space-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cosmic-blue to-cosmic-purple rounded-full flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span>Create New Station</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Station Name
            </Label>
            <Input
              id="name"
              placeholder="Mars Mission Control"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-space-700 border-space-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your station's mission..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-space-700 border-space-600 text-white placeholder:text-gray-400 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-300 flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Station Color</span>
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {colorOptions.map((color) => (
                <motion.button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange("color", color.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? "border-white bg-space-700"
                      : "border-space-600 hover:border-gray-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ backgroundColor: color.color }} />
                  <span className="text-xs text-gray-300">{color.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-space-600 text-gray-300 hover:bg-space-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 bg-cosmic-blue hover:bg-cosmic-blue/80"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </div>
              ) : (
                "Launch Station"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
