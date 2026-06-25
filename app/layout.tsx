import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FINPAL™ SalesOS — AI-Powered CRM',
  description: 'Your AI Sales Team. Working 24/7.',
  keywords: 'CRM, sales, AI, automation, South Africa',
  openGraph: {
    title: 'FINPAL™ SalesOS',
    description: 'AI-powered CRM & Sales Automation Platform',
    url: 'https://app.finpal.online',
    siteName: 'FINPAL™ SalesOS',
    locale: 'en_ZA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0B0C10] text-[#CFD8E3] antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
