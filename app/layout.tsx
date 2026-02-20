import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import PageTransition from '@/components/page-transition'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-serif',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Glinso | Engineering Global Certainty',
  description:
    'A global reinsurance brokerage delivering strategic partnerships, advanced analytics and world-class risk transfer solutions.',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-background text-foreground overflow-x-hidden">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
