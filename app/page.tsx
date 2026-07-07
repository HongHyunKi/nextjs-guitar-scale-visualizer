'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { PixelGuitar } from '@/components/pixel-guitar'
import { AmbientGlow } from '@/components/ambient-glow'

type Feature = {
  id: string
  number: string
  icon: string
  title: string
  titleEn: string
  description: string
  href: string | null // null이면 준비중
  glow: string // rgba — 카드 호버/활성 글로우 색
}

const FEATURES: Feature[] = [
  {
    id: 'scale',
    number: '01',
    icon: '🎸',
    title: '스케일 연습',
    titleEn: 'SCALE PRACTICE',
    description: '6현 지판 위 스케일 시각화 · CAGED · 실시간 사운드',
    href: '/guitar-scale',
    glow: 'rgba(74, 144, 217, 1)',
  },
  {
    id: 'chords',
    number: '02',
    icon: '📖',
    title: '코드사전',
    titleEn: 'CHORD DICTIONARY',
    description: '코드 구성음과 운지법을 지판 위에서 바로 확인',
    href: null,
    glow: 'rgba(235, 145, 70, 1)',
  },
  {
    id: 'metronome',
    number: '03',
    icon: '⏱️',
    title: '메트로놈',
    titleEn: 'METRONOME',
    description: 'BPM · 박자 설정으로 리듬 연습',
    href: null,
    glow: 'rgba(64, 190, 180, 1)',
  },
]

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen overflow-hidden">
        <AmbientGlow />

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none hidden md:block"
        >
          <div className="absolute top-[12%] left-[6%]">
            <PixelGuitar model="lespaul" size="md" delay={0} />
          </div>

          <div className="absolute top-[16%] right-[7%]">
            <PixelGuitar model="telecaster" size="lg" delay={1.5} />
          </div>

          <div className="absolute bottom-[14%] left-[9%]">
            <PixelGuitar model="prs" size="sm" delay={0.8} />
          </div>

          <div className="absolute bottom-[18%] right-[10%]">
            <PixelGuitar model="lespaul" size="md" delay={2} />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-mono text-2xl md:text-4xl lg:text-5xl text-foreground text-center mb-4 tracking-wider"
            style={{
              textShadow:
                '0 0 20px rgba(74, 144, 217, 0.5), 0 0 40px rgba(74, 144, 217, 0.3)',
            }}
          >
            GUITAR SCALEUP
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-mono text-xs md:text-sm text-muted-foreground text-center mb-3 max-w-md tracking-wide"
          >
            방구석 기타리스트를 위한 연습 도구 모음
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-mono text-[10px] text-muted-foreground/60 tracking-[0.3em] mb-12"
            aria-hidden="true"
          >
            ── SELECT MODE ──
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + i * 0.15 }}
              >
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          }}
        />
      </main>
    </MotionConfig>
  )
}

function FeatureCard({ feature }: { feature: Feature }) {
  const isReady = feature.href !== null
  const glowSoft = feature.glow.replace(', 1)', ', 0.35)')
  const glowFaint = feature.glow.replace(', 1)', ', 0.12)')

  const inner = (
    <div
      className={`relative h-full border-2 bg-card/60 backdrop-blur-sm p-5 font-mono transition-all duration-200 ${
        isReady
          ? 'border-border hover:-translate-y-1 group-focus-visible:-translate-y-1'
          : 'border-border/50 opacity-60'
      }`}
      style={
        isReady
          ? ({
              '--card-glow': glowSoft,
              '--card-glow-faint': glowFaint,
            } as CSSProperties)
          : undefined
      }
    >
      {isReady && (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            boxShadow: '0 0 24px var(--card-glow), inset 0 0 24px var(--card-glow-faint)',
          }}
        />
      )}

      <div className="flex items-start justify-between mb-4">
        <span
          className="text-[10px] tracking-widest"
          style={{ color: feature.glow }}
          aria-hidden="true"
        >
          {feature.number}
        </span>
        {isReady ? (
          <span
            className="text-[9px] tracking-widest px-1.5 py-0.5 border"
            style={{ color: feature.glow, borderColor: glowSoft }}
          >
            PLAY ▶
          </span>
        ) : (
          <span className="text-[9px] tracking-widest px-1.5 py-0.5 border border-border text-muted-foreground">
            준비중
          </span>
        )}
      </div>

      <span className="block text-2xl mb-3" aria-hidden="true">
        {feature.icon}
      </span>

      <h2 className="text-sm text-foreground mb-1 tracking-wide">
        {feature.title}
      </h2>
      <p
        className="text-[9px] tracking-[0.2em] mb-3"
        style={{ color: isReady ? feature.glow : undefined }}
        aria-hidden="true"
      >
        {feature.titleEn}
      </p>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
    </div>
  )

  if (isReady && feature.href) {
    return (
      <Link
        href={feature.href}
        className="group block h-full outline-none"
        aria-label={`${feature.title} 시작하기`}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div aria-label={`${feature.title} — 준비중`} className="h-full">
      {inner}
    </div>
  )
}
