import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '튜너 | Guitar ScaleUp',
  description: '마이크로 실시간 피치를 감지해 정확하게 튜닝합니다.',
  alternates: { canonical: '/tuner' },
}

export default function TunerLayout({ children }: { children: ReactNode }) {
  return children
}
