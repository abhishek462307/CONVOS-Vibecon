import './globals.css'

export const metadata = {
  title: 'Convos — Agentic Commerce Platform',
  description: 'AI-powered commerce platform where buyers delegate shopping to intelligent agents and merchants supervise live AI-driven missions.',
}

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`min-h-screen bg-background text-foreground antialiased ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
