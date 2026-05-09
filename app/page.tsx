'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PixelGuitar } from '@/components/pixel-guitar'
import { FloatingNotes } from '@/components/floating-notes'
import { AmbientGlow } from '@/components/ambient-glow'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AmbientGlow />
      <FloatingNotes />

      <div className="absolute inset-0 pointer-events-none">
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <PixelFretboardIcon />
        </motion.div>

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
            <Link href="/guitar-scale">START PRACTICING</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="font-mono text-xs px-8 py-6 border-accent-blue/50 text-foreground hover:bg-accent-blue/10 transition-all hover:scale-105"
          >
            <a
              href="https://github.com/hyunki/nextjs-guitar-scale-visualizer"
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW ON GITHUB
            </a>
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
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
    </main>
  )
}

function PixelFretboardIcon() {
  return (
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 32 32"
      fill="none"
      style={{ imageRendering: 'pixelated' }}
      animate={{
        filter: [
          'drop-shadow(0 0 8px rgba(74, 144, 217, 0.8))',
          'drop-shadow(0 0 16px rgba(217, 74, 138, 0.8))',
          'drop-shadow(0 0 8px rgba(74, 144, 217, 0.8))',
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <rect x="2" y="6" width="28" height="20" fill="#3D2314" />
      <rect x="3" y="7" width="26" height="18" fill="#1a1a1a" />

      <rect x="8" y="6" width="1" height="20" fill="#C0C0C0" />
      <rect x="14" y="6" width="1" height="20" fill="#C0C0C0" />
      <rect x="20" y="6" width="1" height="20" fill="#C0C0C0" />
      <rect x="26" y="6" width="1" height="20" fill="#C0C0C0" />

      <rect x="2" y="8" width="28" height="1" fill="#E8E8E8" opacity="0.6" />
      <rect x="2" y="12" width="28" height="1" fill="#E8E8E8" opacity="0.6" />
      <rect x="2" y="16" width="28" height="1" fill="#E8E8E8" opacity="0.6" />
      <rect x="2" y="20" width="28" height="1" fill="#E8E8E8" opacity="0.6" />
      <rect x="2" y="24" width="28" height="1" fill="#E8E8E8" opacity="0.6" />

      <rect x="10" y="11" width="3" height="3" fill="#4A90D9" />
      <rect x="22" y="15" width="3" height="3" fill="#D94A8A" />
      <rect x="16" y="19" width="3" height="3" fill="#4A90D9" />
      <rect x="4" y="23" width="3" height="3" fill="#4ADADA" />
    </motion.svg>
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
