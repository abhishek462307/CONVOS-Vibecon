import './globals.css'

export const metadata = {
  title: 'Convos — Agentic Commerce Platform',
  description: 'AI-powered commerce platform where buyers delegate shopping to intelligent agents and merchants supervise live AI-driven missions.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
