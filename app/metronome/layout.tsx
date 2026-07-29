import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '메트로놈 | Guitar ScaleUp',
  description: 'BPM과 박자를 설정해 리듬 연습을 합니다.',
  alternates: { canonical: '/metronome' },
}

export default function MetronomeLayout({ children }: { children: ReactNode }) {
  return children
}
