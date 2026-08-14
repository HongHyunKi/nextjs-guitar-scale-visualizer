import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_NAME } from '@/lib/site'

const TITLE = '코드사전 | Guitar ScaleUp'
const DESCRIPTION =
  '코드 구성음과 운지법을 다이어그램으로 확인하고 소리로 들어봅니다.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/chords' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'ko_KR',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function ChordsLayout({ children }: { children: ReactNode }) {
  return children
}
