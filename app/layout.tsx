import { Toaster } from "react-hot-toast"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ResumeCoach AI",
  description: "AI powered resume analyzer",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Navbar />
        <Toaster position="top-right"/>
        {children}
      </body>
    </html>
  )
}