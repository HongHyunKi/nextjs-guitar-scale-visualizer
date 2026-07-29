import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '스케일 연습 | Guitar ScaleUp',
  description:
    '6현 지판 위에 스케일을 시각화하고, CAGED 시스템과 실시간 사운드로 연습합니다.',
  alternates: { canonical: '/guitar-scale' },
}

export default function GuitarScaleLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
