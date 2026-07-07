import type React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://nextjs-guitar-scale-visualizer.vercel.app'),
  title: 'Guitar ScaleUp | 기타 연습 도구 모음 — 스케일 · 코드사전 · 메트로놈',
  description: '방구석 기타리스트를 위한 연습 도구 모음',
  generator: 'dev.hyunki',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Guitar ScaleUp | 기타 연습 도구 모음 — 스케일 · 코드사전 · 메트로놈',
    description: '방구석 기타리스트를 위한 연습 도구 모음',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Guitar ScaleUp',
    // TODO: OG 이미지 추가 시 (권장 1200x630)
    // images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Guitar ScaleUp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guitar ScaleUp | 기타 연습 도구 모음 — 스케일 · 코드사전 · 메트로놈',
    description: '방구석 기타리스트를 위한 연습 도구 모음',
    // TODO: Twitter 카드 이미지 추가 시
    // images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
