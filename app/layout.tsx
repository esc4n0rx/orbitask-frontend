import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Orbitask - Space Project Management",
  description: "Navigate your projects through the cosmos with Orbitask",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-space-900 text-white antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}