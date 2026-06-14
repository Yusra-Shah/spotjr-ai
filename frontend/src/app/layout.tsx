import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'SpotJr — Missing Child Detection',
  description: 'AI-powered missing child detection system',
}

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const body = (
    <html lang="en" className="dark">
      <body style={{ background: 'var(--color-bg-base)', color: 'var(--color-text-primary)', margin: 0 }}>
        {children}
      </body>
    </html>
  )

  if (publishableKey) {
    return <ClerkProvider publishableKey={publishableKey}>{body}</ClerkProvider>
  }

  return body
}
