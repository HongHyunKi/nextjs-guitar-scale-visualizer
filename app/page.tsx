'use client'

import Link from 'next/link'
import { motion, MotionConfig } from 'framer-motion'
import { PixelGuitar } from '@/components/pixel-guitar'
import { AmbientGlow } from '@/components/ambient-glow'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen overflow-hidden">
        <AmbientGlow />

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none hidden md:block"
        >
          <div className="absolute top-[10%] left-[8%]">
            <PixelGuitar model="lespaul" size="md" delay={0} />
          </div>

          <div className="absolute top-[12%] right-[10%]">
            <PixelGuitar model="telecaster" size="lg" delay={1.5} />
          </div>

          <div className="absolute top-[38%] left-[5%]">
            <PixelGuitar model="prs" size="sm" delay={0.8} />
          </div>

          <div className="absolute top-[45%] right-[6%]">
            <PixelGuitar model="lespaul" size="lg" delay={2} />
          </div>

          <div className="absolute bottom-[18%] left-[12%]">
            <PixelGuitar model="telecaster" size="sm" delay={0.5} />
          </div>

          <div className="absolute bottom-[15%] right-[15%]">
            <PixelGuitar model="prs" size="md" delay={1.2} />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
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
            className="font-mono text-xs md:text-sm text-muted-foreground text-center mb-12 max-w-md tracking-wide"
          >
            방구석 기타리스트를 위한 스케일 시각화
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              asChild
              size="lg"
              className="font-mono text-xs px-8 py-6 bg-accent-blue hover:bg-accent-blue/90 text-foreground transition-all hover:scale-105"
              style={{
                boxShadow:
                  '0 0 20px rgba(74, 144, 217, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Link href="/guitar-scale">스케일 연습 시작하기</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 sm:gap-12 px-4"
          >
            <FeatureItem icon="🎸" label="6현 지판 시각화" />
            <FeatureItem icon="🎵" label="실시간 사운드" />
            <FeatureItem icon="🎯" label="CAGED 시스템" />
          </motion.div>
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

function FeatureItem({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: 1.1 }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-mono text-[10px] text-muted-foreground tracking-wider whitespace-nowrap">
        {label}
      </span>
    </motion.div>
  )
}
