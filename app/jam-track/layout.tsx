import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_NAME } from '@/lib/site'

const TITLE = '잼 트랙 | GuitarKit'
const DESCRIPTION =
  '루트와 스케일을 고르고 스타일별 백킹 트랙(코드+드럼)에 맞춰 즉흥 연주를 연습합니다.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/jam-track' },
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

export default function JamTrackLayout({ children }: { children: ReactNode }) {
  return children
}
