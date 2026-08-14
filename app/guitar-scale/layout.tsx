import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_NAME } from '@/lib/site'

const TITLE = '스케일 연습 | Guitar ScaleUp'
const DESCRIPTION =
  '6현 지판 위에 스케일을 시각화하고, CAGED 시스템과 실시간 사운드로 연습합니다.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/guitar-scale' },
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

export default function GuitarScaleLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
