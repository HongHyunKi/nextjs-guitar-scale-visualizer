import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_NAME } from '@/lib/site'

const TITLE = '튜너 | Guitar ScaleUp'
const DESCRIPTION = '마이크로 실시간 피치를 감지해 정확하게 튜닝합니다.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/tuner' },
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

export default function TunerLayout({ children }: { children: ReactNode }) {
  return children
}
