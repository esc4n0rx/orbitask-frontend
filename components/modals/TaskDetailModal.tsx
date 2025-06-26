"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, User, MessageCircle, Paperclip, Clock, Flag, Edit, Trash2, Send, Plus } from "lucide-react"

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: any
}

const mockComments = [
  {
    id: 1,
    user: { name: "Neil Armstrong", avatar: "/placeholder.svg?height=32&width=32" },
    content: "I've started working on the initial design. The rover specifications look good so far.",
    timestamp: "2 hours ago",
    edited: false,
  },
  {
    id: 2,
    user: { name: "Buzz Aldrin", avatar: "/placeholder.svg?height=32&width=32" },
    content:
      "Great progress! I've added some feedback on the propulsion system. Let me know if you need any clarification.",
    timestamp: "1 hour ago",
    edited: true,
  },
  {
    id: 3,
    user: { name: "Sally Ride", avatar: "/placeholder.svg?height=32&width=32" },
    content: "The design looks promising. I'll review the safety protocols and get back to you by tomorrow.",
    timestamp: "30 minutes ago",
    edited: false,
  },
]

const mockAttachments = [
  { name: "rover-specifications.pdf", size: "2.4 MB", type: "pdf" },
  { name: "design-mockup.png", size: "1.8 MB", type: "image" },
  { name: "safety-checklist.docx", size: "856 KB", type: "document" },
]

export function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  const [newComment, setNewComment] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  if (!task) return null

  const handleSaveEdit = () => {
    setIsEditing(false)
    // Mock save
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return
    // Mock add comment
    setNewComment("")
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-space-800 border-space-600 text-white max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-space-600 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-xl font-semibold bg-space-700 border-space-600 text-white mb-2"
                />
              ) : (
                <DialogTitle className="text-xl text-white mb-2">{task.title}</DialogTitle>
              )}
              <div className="flex items-center space-x-4">
                <Badge className={getPriorityColor(task.priority)}>
                  <Flag className="w-3 h-3 mr-1" />
                  {task.priority} priority
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{task.assignee.name}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-400 hover:text-white"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="details" className="h-full flex flex-col">
            <TabsList className="bg-space-700 border-space-600 mb-4">
              <TabsTrigger value="details" className="data-[state=active]:bg-cosmic-blue">
                Details
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-cosmic-blue">
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments ({mockComments.length})
              </TabsTrigger>
              <TabsTrigger value="attachments" className="data-[state=active]:bg-cosmic-blue">
                <Paperclip className="w-4 h-4 mr-2" />
                Attachments ({mockAttachments.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="details" className="space-y-6 mt-0">
                <div>
                  <h3 className="text-white font-medium mb-3">Description</h3>
                  {isEditing ? (
                    <Textarea
                      value={editedTask.description}
                      onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                      className="bg-space-700 border-space-600 text-white resize-none"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-300 bg-space-700/50 p-4 rounded-lg">{task.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-medium mb-3">Assignee</h3>
                    <div className="flex items-center space-x-3 bg-space-700/50 p-3 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple">
                          {task.assignee.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{task.assignee.name}</p>
                        <p className="text-gray-400 text-sm">Astronaut</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map((tag: string, index: number) => (
                        <span key={index} className="text-xs bg-cosmic-blue/20 text-cosmic-blue px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-gray-400 hover:text-white border border-dashed border-space-600"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add tag
                      </Button>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-space-600">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-space-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                      Save Changes
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-4 mt-0">
                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple text-xs">
                          {comment.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-space-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm">{comment.user.name}</span>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{comment.timestamp}</span>
                            {comment.edited && <span>(edited)</span>}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="border-t border-space-600 pt-4">
                  <div className="flex space-x-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-cosmic-blue/20 text-cosmic-blue text-xs">NA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="bg-space-700 border-space-600 text-white placeholder:text-gray-400 resize-none mb-3"
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="bg-cosmic-blue hover:bg-cosmic-blue/80"
                          size="sm"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-4 mt-0">
                <div className="space-y-3">
                  {mockAttachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-space-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cosmic-blue/20 rounded-lg flex items-center justify-center">
                          <Paperclip className="w-5 h-5 text-cosmic-blue" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{attachment.name}</p>
                          <p className="text-gray-400 text-xs">{attachment.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-cosmic-blue hover:text-cosmic-blue/80">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-space-600 pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-space-600 text-gray-300 hover:border-cosmic-blue hover:text-cosmic-blue"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Attachment
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
