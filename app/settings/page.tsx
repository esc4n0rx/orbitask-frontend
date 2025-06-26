"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/shared/Sidebar"
import { OrbitAIWidget } from "@/components/shared/OrbitAIWidget"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Shield, Palette, Globe, Key, Camera, Save, Trash2, Moon, Sun } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [profileData, setProfileData] = useState({
    name: user?.full_name || "",
    email: user?.email || "",
    bio: "Space exploration enthusiast.",
    location: "Houston, TX",
    website: "https://orbitask.com",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    teamMentions: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  const [preferences, setPreferences] = useState({
    darkMode: true,
    language: "en",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    startOfWeek: "monday",
  })

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    // TODO: Implementar atualização do perfil via API
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    })
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-space-900">
        <Sidebar />

        <main className="flex-1 p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account and application preferences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-space-800 border-space-600">
                <TabsTrigger value="profile" className="data-[state=active]:bg-cosmic-blue">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-cosmic-blue">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="preferences" className="data-[state=active]:bg-cosmic-blue">
                  <Palette className="w-4 h-4 mr-2" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-cosmic-blue">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-space-800/50 border-space-600">
                    <CardHeader>
                      <CardTitle className="text-white">Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="relative inline-block mb-4">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src="/placeholder.svg?height=96&width=96" />
                          <AvatarFallback className="bg-cosmic-purple/20 text-cosmic-purple text-2xl">
                            {user?.full_name?.split(" ").map(n => n[0]).join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-cosmic-blue hover:bg-cosmic-blue/80"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Upload a new profile picture. Max size: 5MB</p>
                      <Button variant="outline" className="border-space-600 text-gray-300">
                        Change Picture
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2 bg-space-800/50 border-space-600">
                    <CardHeader>
                      <CardTitle className="text-white">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Full Name</Label>
                          <Input
                            value={profileData.name}
                            onChange={(e) => handleProfileChange("name", e.target.value)}
                            className="bg-space-700 border-space-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Email</Label>
                          <Input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleProfileChange("email", e.target.value)}
                            className="bg-space-700 border-space-600 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Bio</Label>
                        <Textarea
                          value={profileData.bio}
                          onChange={(e) => handleProfileChange("bio", e.target.value)}
                          className="bg-space-700 border-space-600 text-white resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Location</Label>
                          <Input
                            value={profileData.location}
                            onChange={(e) => handleProfileChange("location", e.target.value)}
                            className="bg-space-700 border-space-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Website</Label>
                          <Input
                            value={profileData.website}
                            onChange={(e) => handleProfileChange("website", e.target.value)}
                            className="bg-space-700 border-space-600 text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" className="border-space-600 text-gray-300">
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card className="bg-space-800/50 border-space-600">
                  <CardHeader>
                    <CardTitle className="text-white">Notification Preferences</CardTitle>
                    <p className="text-gray-400">Choose how you want to be notified</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-white font-medium">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          {
                            key: "emailNotifications",
                            label: "Email notifications",
                            desc: "Receive notifications via email",
                          },
                          { key: "taskUpdates", label: "Task updates", desc: "Get notified when tasks are updated" },
                          { key: "teamMentions", label: "Team mentions", desc: "When someone mentions you in comments" },
                          { key: "weeklyDigest", label: "Weekly digest", desc: "Summary of your week's activity" },
                          { key: "marketingEmails", label: "Marketing emails", desc: "Product updates and tips" },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-white">{item.label}</p>
                              <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                            <Switch
                              checked={notifications[item.key as keyof typeof notifications]}
                              onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-medium">Push Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">Browser notifications</p>
                          <p className="text-gray-400 text-sm">Show notifications in your browser</p>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <Card className="bg-space-800/50 border-space-600">
                  <CardHeader>
                    <CardTitle className="text-white">Application Preferences</CardTitle>
                    <p className="text-gray-400">Customize your Orbitask experience</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-white font-medium flex items-center space-x-2">
                          <Palette className="w-4 h-4" />
                          <span>Appearance</span>
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Dark mode</p>
                            <p className="text-gray-400 text-sm">Use dark theme</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Sun className="w-4 h-4 text-gray-400" />
                            <Switch
                              checked={preferences.darkMode}
                              onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)}
                            />
                            <Moon className="w-4 h-4 text-cosmic-blue" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-white font-medium flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>Localization</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Language</Label>
                            <Input value="English (US)" className="bg-space-700 border-space-600 text-white" readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-300">Timezone</Label>
                            <Input
                              value="UTC-5 (Eastern Time)"
                              className="bg-space-700 border-space-600 text-white"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="space-y-6">
                  <Card className="bg-space-800/50 border-space-600">
                    <CardHeader>
                      <CardTitle className="text-white">Change Password</CardTitle>
                      <p className="text-gray-400">Update your password to keep your account secure</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Current Password</Label>
                        <Input type="password" className="bg-space-700 border-space-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">New Password</Label>
                        <Input type="password" className="bg-space-700 border-space-600 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Confirm New Password</Label>
                        <Input type="password" className="bg-space-700 border-space-600 text-white" />
                      </div>
                      <Button className="bg-cosmic-blue hover:bg-cosmic-blue/80">
                        <Key className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-space-800/50 border-space-600">
                    <CardHeader>
                      <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
                      <p className="text-gray-400">Add an extra layer of security to your account</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">Two-factor authentication</p>
                          <p className="text-gray-400 text-sm">Secure your account with 2FA</p>
                        </div>
                        <Button variant="outline" className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10">
                          Enable 2FA
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-500/10 border-red-500/30">
                    <CardHeader>
                      <CardTitle className="text-red-400">Danger Zone</CardTitle>
                      <p className="text-gray-400">Irreversible and destructive actions</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">Delete Account</p>
                          <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>

        <OrbitAIWidget />
      </div>
    </ProtectedRoute>
  )
}