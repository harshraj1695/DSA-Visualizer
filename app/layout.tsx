import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DSA-Visualizer',
  description: 'Created by Harsh Raj Singh',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
