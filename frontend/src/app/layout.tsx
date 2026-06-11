import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SpotJr — Missing Child Detection',
  description: 'AI-powered missing child detection system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body style={{ background: 'var(--color-bg-base)', color: 'var(--color-text-primary)', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
