import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '코드사전 | Guitar ScaleUp',
  description:
    '코드 구성음과 운지법을 다이어그램으로 확인하고 소리로 들어봅니다.',
  alternates: { canonical: '/chords' },
}

export default function ChordsLayout({ children }: { children: ReactNode }) {
  return children
}
